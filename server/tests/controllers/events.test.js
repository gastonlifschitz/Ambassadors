const moment = require('moment');
const ctrl = require('../../controllers/events');
const Event = require('../../model/events');
const testEvent = require('../model/events');
const testDb = require('../model/db');
const notificationService = require('../../services/notification');
const sinon = require('sinon');

describe('Events Controller', () => {
  const { assert } = sinon;
  const tomorrow = new Date();
  const today = new Date();
  tomorrow.setDate(today.getDate() + 1);
  let userStub;
  let req;
  let res;

  const assertOnceWith = (stub, value) => {
    assert.calledOnce(stub);

    const arg = cleanMongooseObj(getStubArgs(stub)[0]);
    value = cleanMongooseObj(value);

    if (Array.isArray(value))
      arrayContaining(arg, value);
    else
      expect(arg).toEqual(value);
  };

  const fakeObjectId = 'a'.repeat(24);
  const cleanMongooseObj = obj => JSON.parse(JSON.stringify(obj));
  const expectEqualMongooseObj = (obj1, obj2) => expect(cleanMongooseObj(obj1)).toEqual(cleanMongooseObj(obj2));
  const getStubArgs = stub => stub.getCall(0).args;
  const arrayContaining = (s1, s2) => {
    expect(s2).toHaveLength(s2.length);
    expect(s1).toEqual(expect.arrayContaining(s2));
    expect(s2).toEqual(expect.arrayContaining(s1));
  };

  const expectEqualUser = (actual, expected) => {
    expect(actual.uid).toEqual(expected.uid);
    expect(actual.firstName).toEqual(expected.firstName);
    expect(actual.lastName).toEqual(expected.lastName);
    expect(actual.email).toEqual(expected.email);
  };

  const expectEqualNotification = (actual, expected) => {
    expect(actual.tag).toEqual(expected.tag);
    expect(actual.description).toEqual(expected.description);
    expectEqualUser(actual.author, expected.author);
  };

  beforeAll(() => testDb.connect());
  afterAll(() => testDb.drop());

  beforeEach(() => {
    userStub = testEvent.userStub();

    req = { 
      params: {},
      query: {},
      protocol: 'https',
      get: () => 'ambassadors.mybluemix.net',
      originalUrl: '/',
      user: userStub
    };

    res = {
      status: sinon.spy(),
      json: sinon.spy(),
      set: () => {}
    };
  });

  afterEach(() => testDb.clear(Event));

  describe('.listEvents', () => {
    it('should return status 200 with the events list as json on success', async () => {
      let expectedEvents = await testEvent.insert({ name: 'first event' }, { name: 'second event' }, { name: 'third event' });
      expectedEvents = testEvent.select(expectedEvents);
      try {
        await ctrl.listEvents(req, res);
      }
      finally {
        assertOnceWith(res.status, 200);
        assertOnceWith(res.json, expectedEvents);
      }
    });

    const testFilter = async (queryName, params, events, filterGenerator) => {
      events = testEvent.select(events);
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        req.query[queryName] = param;
        await ctrl.listEvents(req, res);
        assertOnceWith(res.status, 200);
        assertOnceWith(res.json, events.filter(filterGenerator(param)));
        res = {
          status: sinon.spy(),
          json: sinon.spy(),
          set: () => {}         
        };
      }
    };

    it('should filter by state given the state query param', async () => {
      const states = ['scheduled', 'approved', 'completed'];
      const events = await testEvent.insert(
        { state: 'scheduled' }, 
        { name: 'second', state: 'scheduled' }, 
        { name: 'third', state: 'approved' }
      );
      
      await testFilter('state', states, events, state => e => e.state === state);
    });

    it('should filter by owner given the uid query param', async () => {
      const uids = ['063329', '578629897', '063328'];
      const events = await testEvent.insert(
        { owner: testEvent.userStub({ uid: '063329' }) }, 
        { owner: testEvent.userStub({ uid: '092016' }) }, 
        { owner: testEvent.userStub({ uid: '063329' }) }
      );

      await testFilter('uid', uids, events, uid => e => e.owner.uid === uid);      
    });

    it('should return status 400 with the error as json on error', async () => {
      const expectedError = {
        message: 'fatal error'
      };

      sinon.stub(Event, 'find');
      
      Event.find.returns({
        select: () => ({
          count: () => Promise.reject(expectedError),
          skip: () => ({
            limit: () => Promise.reject(expectedError)
          })
        })
      });

      try {
        await ctrl.listEvents(req, res);
      }
      finally {
        Event.find.restore();
        assertOnceWith(res.status, 400);
        assertOnceWith(res.json, expectedError);
      }
    });
  });

  describe('.createEvent', () => {
    let actual;

    beforeEach(async () => {
      sinon.stub(notificationService, 'notifyCreated');
      const stub = testEvent.eventStub({ date: tomorrow, notifications: [] });
      delete stub.state;
      req.body = stub;
    });

    afterEach(() => {
      notificationService.notifyCreated.restore();
    });

    describe('on success', () => {
      beforeEach(async () => {
        await ctrl.createEvent(req, res);
        const arr = await Event.find();
        actual = arr[0];
      });

      it('should return 201 with the created event', () => {
        assertOnceWith(res.status, 201);
        assertOnceWith(res.json, actual);
      });

      it('should set the event state to scheduled if state was empty', () => {
        expect(actual.state).toEqual('scheduled');
      });

      it('should set event owner property equal to logged user', () => {
        const { owner } = actual;
        expectEqualUser(owner, userStub);
      });

      it('should send event created notification', () => {
        assertOnceWith(notificationService.notifyCreated, actual);
      });

      it('should set the creation notification', () => {
        const actualNotification = actual.notifications[0];
        expect(actualNotification.tag).toEqual('creation');
        expectEqualUser(actualNotification.author, userStub);
      });
    });

    describe('on failure', () => {
      beforeEach(async () => {
        req.body.date = 'invalid';
        await ctrl.createEvent(req, res);
        const arr = await Event.find();
        actual = arr[0];
      });

      it('should return 400 if the event is invalid', () => {
        assertOnceWith(res.status, 400);
        assert.notCalled(notificationService.notifyCreated);
      });
    });
  });

  describe('.editEvent', () => {
    let inserted;

    beforeEach(async () => {
      sinon.stub(notificationService, 'notifyEditted');
      sinon.stub(notificationService, 'scheduleEventEnd');

      const arr = await testEvent.insert({ date: tomorrow });
      inserted = arr[0];

      const stub = testEvent.eventStub({ name: 'editted name', date: tomorrow });
      req.params.id = inserted.id;
      req.body = stub;
    });

    afterEach(() => {
      notificationService.notifyEditted.restore();
      notificationService.scheduleEventEnd.restore();
    });

    it('should return 200 with the editted event if owner', async () => {
      try {
        req.isAdmin = false;
        await ctrl.editEvent(req, res);
      }
      finally {
        const actual = await Event.findById(inserted.id);

        assertOnceWith(res.status, 200);
        assertOnceWith(res.json, actual);
      }
    });

    it('should return 200 with the editted event if admin', async () => {
      try {
        req.user.id += 1;
        req.user.isAdmin = true;
        await ctrl.editEvent(req, res);
      }
      finally {
        const actual = await Event.findById(inserted.id);

        assertOnceWith(res.status, 200);
        assertOnceWith(res.json, actual);
      }
    });

    it('should schedule event if the date was editted', async () => {
      try {
        req.body.date = moment(inserted.date)
          .add(2, 'days')
          .toDate();

        await ctrl.editEvent(req, res);
      }
      finally {
        const actual = await Event.findById(inserted.id);

        assertOnceWith(notificationService.scheduleEventEnd, actual);
      }
    });

    it('should NOT schedule event if the date was NOT editted', async () => {
      try {
        req.body.date = inserted.date;
        await ctrl.editEvent(req, res);
      }
      finally {
        assert.notCalled(notificationService.scheduleEventEnd);
      }
    });

    it('should send editted notification if not admin', async () => {
      try {
        req.user.isAdmin = false;
        await ctrl.editEvent(req, res);
      }
      finally {
        // const actual = await Event.findById(inserted.id);

        assert.calledOnce(notificationService.notifyEditted);
        // assert.calledWith(notificationService.notifyEditted, inserted.toJSON(), actual.toJSON());
      }
    });

    it('should set the edittion notification', async () => {
      let prevNotificationsLen;
      let prevNotifications;
      try {
        prevNotifications = req.body.notifications;
        prevNotificationsLen = prevNotifications.length;
        await ctrl.editEvent(req, res);
      }
      finally {
        const actual = await Event.findById(inserted.id);
        const actualNotifications = actual.notifications;
        const actualNotification = actualNotifications[actualNotifications.length - 1];

        expect(actualNotifications.length).toEqual(prevNotificationsLen + 1);
        expectEqualNotification(actualNotification, {
          tag: 'edit',
          author: req.user
        });

        for (let i = 0; i < actualNotifications.length - 1; i++)
          expectEqualNotification(actualNotifications[i], prevNotifications[i]);
      }
    });

    it('should NOT send editted notification if admin', async () => {
      try {
        req.user.isAdmin = true;
        await ctrl.editEvent(req, res);
      }
      finally {
        assert.notCalled(notificationService.notifyEditted);
      }
    });

    it('should return 404 on event not found', async () => {
      try {
        req.params.id = fakeObjectId;
        await ctrl.editEvent(req, res);
      }
      finally {
        assertOnceWith(res.status, 404);
        assert.notCalled(notificationService.notifyEditted);
        assert.notCalled(notificationService.scheduleEventEnd);
      }
    });

    it('should return 400 if the event is invalid', async () => {
      try {
        req.body.date = 'invalid';
        await ctrl.editEvent(req, res);
      }
      finally {
        assertOnceWith(res.status, 400);
        assert.notCalled(notificationService.notifyEditted);
        assert.notCalled(notificationService.scheduleEventEnd);
      }
    });

    it('should return 403 if not admin nor owner', async () => {
      try {
        req.user.uid = req.user.uid + 1;
        req.user.isAdmin = false;
        await ctrl.editEvent(req, res);
      }
      finally {
        assertOnceWith(res.status, 403);
        assert.notCalled(notificationService.notifyEditted);
        assert.notCalled(notificationService.scheduleEventEnd);
      }  
    });
  });

  describe('.deleteEvent', () => {
    let inserted;

    beforeEach(async () => {
      sinon.stub(notificationService, 'notifyEventDeleted');

      const arr = await testEvent.insert({ date: tomorrow });
      inserted = arr[0];
      req.params.id = inserted.id;
    });

    afterEach(() => {
      notificationService.notifyEventDeleted.restore();
    });

    const assertDeletion = async event => {
      const actual = await Event.find();
      expect(actual).toHaveLength(0);
      assertOnceWith(res.status, 204);
      assertOnceWith(notificationService.notifyEventDeleted, event);
    };

    it('should delete the event from the database and return 204 if owner', async () => {
      try {
        req.isAdmin = false;
        await ctrl.deleteEvent(req, res);
      }
      finally {
        await assertDeletion(inserted);
      }
    });

    it('should delete the event from the database and return 204 if admin', async () => {
      try {
        req.isAdmin = true;
        req.user.id += 1;
        await ctrl.deleteEvent(req, res);
      }
      finally {
        await assertDeletion(inserted);
      }
    });

    it('should return 204 and not send notification if event not found', async () => {
      try {
        req.params.id = fakeObjectId;
        await ctrl.deleteEvent(req, res);
      }
      finally {
        assertOnceWith(res.status, 204);
        assert.notCalled(notificationService.notifyEventDeleted);
      }      
    });

    it('should not delete the event and return 403 if not owner nor admin', async () => {
      try {
        req.user.uid += 1;
        req.user.isAdmin = false;
        await ctrl.deleteEvent(req, res);
      }
      finally {
        const actual = await Event.findById(inserted.id);
        assert.notCalled(notificationService.notifyEventDeleted);
        expectEqualMongooseObj(actual, inserted);
        assertOnceWith(res.status, 403);
      }
    });
  });
});
