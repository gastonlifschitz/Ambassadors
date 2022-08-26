/* eslint newline-per-chained-call: 0 */

const sinon = require('sinon');
const deepDiff = require('deep-diff');
const moment = require('moment');
const service = require('../../services/notification');
const emailBuilder = require('../../services/emailBuilder');
const emailService = require('../../services/email');
const scheduler = require('../../services/scheduler');
const testEvent = require('../model/events');

const SCHEDULE_HOUR = service.scheduleHour;
const {
  assert
} = sinon;
const receptor = process.env.RECEPTOR_MAIL || '';

const fakeEmail = content => ({
  title: `title ${content}`,
  content
});

describe('Notification service', () => {
  beforeEach(() => {
    sinon.stub(emailService, 'sendEmail');
    emailService.sendEmail.resolves('email sent');
  });

  afterEach(() => {
    emailService.sendEmail.restore();
  });

  describe('.notifyCreated', () => {
    beforeEach(() => {
      sinon.stub(emailBuilder, 'eventCreatedAdmin');
      sinon.stub(emailBuilder, 'eventCreated');
    });

    afterEach(() => {
      emailBuilder.eventCreatedAdmin.restore();
      emailBuilder.eventCreated.restore();
    });

    it('should notify ambassador and admins', async () => {
      const {
        eventCreatedAdmin,
        eventCreated
      } = emailBuilder;
      const {
        sendEmail
      } = emailService;

      const expectedAdminEmail = fakeEmail('admin');
      const expectedAmbassadorEmail = fakeEmail('ambassador');
      const eventStub = testEvent.eventStubWithId();

      eventCreatedAdmin.returns(expectedAdminEmail);
      eventCreated.returns(expectedAmbassadorEmail);

      await service.notifyCreated(eventStub);

      assert.calledOnce(eventCreatedAdmin);
      assert.calledWith(eventCreatedAdmin, eventStub);

      assert.calledOnce(eventCreated);
      assert.calledWith(eventCreated, eventStub);

      assert.calledTwice(sendEmail);
      assert.calledWith(sendEmail, expectedAdminEmail.title, receptor, expectedAdminEmail.content);
      assert.calledWith(sendEmail, expectedAmbassadorEmail.title, eventStub.owner.email, expectedAmbassadorEmail.content);
    });
  });

  describe('.notifyEditted', () => {
    beforeEach(() => {
      sinon.stub(emailBuilder, 'eventEditted');
    });

    afterEach(() => {
      emailBuilder.eventEditted.restore();
    });

    it('should send the editted notification with the diff object templated to the admins', async () => {
      const {
        diff
      } = deepDiff;
      const {
        eventEditted
      } = emailBuilder;
      const {
        sendEmail
      } = emailService;

      const expectedEmail = fakeEmail('editted');
      const oldEventStub = testEvent.eventStubWithId();
      const newEventStub = testEvent.eventStubWithId({
        name: 'new name',
      });
      const expectedDiff = diff(oldEventStub, newEventStub);

      eventEditted.returns(expectedEmail);

      await service.notifyEditted(oldEventStub, newEventStub);

      assert.calledOnce(eventEditted);
      assert.calledWith(eventEditted, newEventStub, expectedDiff);

      assert.calledOnce(sendEmail);
      assert.calledWith(sendEmail, expectedEmail.title, receptor, expectedEmail.content);
    });
  });

  describe('.scheduleEventEnd', () => {
    beforeEach(() => {
      sinon.stub(emailBuilder, 'eventFinishedAdmin');
      sinon.stub(emailBuilder, 'eventFinished');
      sinon.spy(scheduler, 'schedule');
    });

    afterEach(() => {
      emailBuilder.eventFinishedAdmin.restore();
      emailBuilder.eventFinished.restore();
      scheduler.schedule.restore();
    });

    const assertScheduled = async (event, callCount) => {
      const scheduleDate = moment(event.date)
        .utcOffset(-180)
        .add(1, 'days')
        .hours(SCHEDULE_HOUR)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)
        .toDate();

      await service.scheduleEventEnd(event);

      assert.notCalled(emailBuilder.eventFinishedAdmin);
      assert.notCalled(emailBuilder.eventFinished);
      assert.notCalled(emailService.sendEmail);

      assert.callCount(scheduler.schedule, callCount);
      assert.calledWith(scheduler.schedule, scheduleDate, event.id, sinon.match.func);

      expect(scheduler.isScheduled(event.id)).toBe(true);
    };

    it('should schedule today events', async () => {
      const stub = testEvent.eventStubWithId({
        date: new Date()
      });
      await assertScheduled(stub, 1);
    });

    it('should schedule future events', async () => {
      const tomorrow = moment().add(1, 'days');
      const stub1 = testEvent.eventStubWithId({
        date: tomorrow.toDate()
      }, '1');
      const stub2 = testEvent.eventStubWithId({
        date: moment(tomorrow)
          .add(1, 'days')
          .toDate()
      }, '2');

      await assertScheduled(stub1, 1);
      await assertScheduled(stub2, 2);
    });

    it('should schedule events from yesterday if it is before schedule hour today', async () => {
      const beforeSchedule = moment()
        .utcOffset(-180)
        .hours(SCHEDULE_HOUR - 1)
        .minutes(0)
        .seconds(0);

      const yesterday = moment().subtract(1, 'days');
      const clock = sinon.useFakeTimers(beforeSchedule.valueOf());

      const stub1 = testEvent.eventStubWithId({
        date: moment(yesterday).utcOffset(-180).hours(SCHEDULE_HOUR - 1).toDate()
      }, '1');
      const stub2 = testEvent.eventStubWithId({
        date: moment(yesterday).utcOffset(-180).hours(SCHEDULE_HOUR + 1).toDate()
      }, '2');
      const stub3 = testEvent.eventStubWithId({
        date: moment(yesterday).utcOffset(-180).hours(SCHEDULE_HOUR).toDate()
      }, '3');

      try {
        await assertScheduled(stub1, 1);
        await assertScheduled(stub2, 2);
        await assertScheduled(stub3, 3);
      } finally {
        clock.restore();
      }
    });

    xit('should send notifications every repeat interval for scheduled events', async () => {
      const today = moment();
      const stub = testEvent.eventStubWithId({
        date: today.toDate()
      });
      const clock = sinon.useFakeTimers(today.toDate());

      const finishedAdminEmail = fakeEmail(`finished admin ${stub.id}`);
      const finishedEmail = fakeEmail(`finished ${stub.id}`);

      emailBuilder.eventFinishedAdmin.returns(finishedAdminEmail);
      emailBuilder.eventFinished.returns(finishedEmail);

      await service.scheduleEventEnd(stub);

      clock.tick(service.repeatInterval.days * 8.64e+7 * 5);

      assert.callCount(emailService.sendEmail, 4);
      assert.calledWith(emailService.sendEmail, finishedAdminEmail.title, receptor, finishedAdminEmail.content);
      assert.calledWith(emailService.sendEmail, finishedEmail.title, event.owner.email, finishedEmail.content);
      clock.restore();
    });

    const assertReminder = async (event, callCount, lastReminderDate) => {
      const reminderDate = moment(lastReminderDate)
        .utcOffset(-180)
        .add(service.repeatInterval)
        .hours(SCHEDULE_HOUR)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)
        .toDate();

      await service.scheduleEventEnd(event);

      assert.callCount(scheduler.schedule, callCount);
      assert.notCalled(emailService.sendEmail);
      assert.notCalled(emailBuilder.eventFinishedAdmin);
      assert.notCalled(emailBuilder.eventFinished);

      assert.calledWith(scheduler.schedule, reminderDate, event.id, sinon.match.func, service.repeatInterval);

      expect(scheduler.isScheduled(event.id)).toBe(true);
    };

    const reminderNotification = date => ({
      tag: 'completionReminder',
      timestamp: date
    });

    it('should schedule reminder for events before yesterday', async () => {
      const beforeYesterday = moment().subtract(2, 'days');
      const lastReminderDate = moment(beforeYesterday).add(5, 'days').toDate();

      const stub1 = testEvent.eventStubWithId({
        date: beforeYesterday.toDate()
      }, '1');
      stub1.notifications.push(reminderNotification(beforeYesterday.toDate()));
      stub1.notifications.push(reminderNotification(lastReminderDate));

      const stub2 = testEvent.eventStubWithId({
        date: moment(beforeYesterday).subtract(1, 'days').toDate()
      }, '2');
      stub2.notifications.push(reminderNotification(beforeYesterday.toDate()));

      const stub3 = testEvent.eventStubWithId({
        date: moment(beforeYesterday).subtract(30, 'days').toDate()
      }, '3');

      await assertReminder(stub1, 1, lastReminderDate);
      await assertReminder(stub2, 2, beforeYesterday.toDate());
      await assertReminder(stub3, 3, new Date());
    });

    it('should schedule reminders for yesterday events if it is today after schedule', async () => {
      const afterSchedule = moment()
        .utcOffset(-180)
        .hours(SCHEDULE_HOUR + 1)
        .minutes(0)
        .seconds(0);

      const yesterday = moment().subtract(1, 'days');
      const clock = sinon.useFakeTimers(afterSchedule.valueOf());

      const stub1 = testEvent.eventStubWithId({
        date: moment(yesterday).utcOffset(-180).hours(SCHEDULE_HOUR - 1).toDate()
      }, '1');
      const stub2 = testEvent.eventStubWithId({
        date: moment(yesterday).utcOffset(-180).hours(SCHEDULE_HOUR + 1).toDate()
      }, '2');
      const stub3 = testEvent.eventStubWithId({
        date: moment(yesterday).utcOffset(-180).hours(SCHEDULE_HOUR).toDate()
      }, '3');

      try {
        await assertReminder(stub1, 1);
        await assertReminder(stub2, 2);
        await assertReminder(stub3, 3);
      } finally {
        clock.restore();
      }
    });
  });

  describe('.notifyEventDeleted', () => {
    let stub;

    beforeEach(() => {
      sinon.stub(emailBuilder, 'eventDeleted');
      stub = testEvent.eventStubWithId();
    });

    afterEach(() => {
      emailBuilder.eventDeleted.restore();
    });

    it('should notify admins', async () => {
      const emailDeleted = fakeEmail('deleted');
      const {
        eventDeleted
      } = emailBuilder;
      const {
        sendEmail
      } = emailService;

      eventDeleted.returns(emailDeleted);

      await service.notifyEventDeleted(stub);

      assert.calledOnce(eventDeleted);
      assert.calledWith(eventDeleted, stub);

      assert.calledOnce(sendEmail);
      assert.calledWith(sendEmail, emailDeleted.title, receptor, emailDeleted.content);
    });

    it('should cancel the event schedule', async () => {
      const {
        eventDeleted
      } = emailBuilder;
      const tomorrow = moment().add(1, 'days').toDate();
      const emailDeleted = fakeEmail('deleted');

      eventDeleted.returns(emailDeleted);

      scheduler.schedule(tomorrow, stub.id, () => {});

      expect(scheduler.isScheduled(stub.id)).toBe(true);

      await service.notifyEventDeleted(stub);

      expect(scheduler.isScheduled(stub.id)).toBe(false);
    });
  });
});