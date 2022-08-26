const Event = require('../../model/events');
const events = {};

const stubOwner = {
  firstName: 'Tomas',
  lastName: 'Cerda',
  email: 'tomas.cerda@ibm.com',
  _id: '063329',
  uid: '063329'
};

events.eventStub = (params = {}) => ({
  state: params.state || 'approved',
  name: params.name || 'Great event',
  description: params.description || 'It will be a great event with lots of high quality content',
  owner: params.owner || stubOwner,
  location: params.location || {
    institution: 'Dinseyland',
    address: 'Ricky Fort 666'
  },
  date: params.date || new Date(),
  category: params.category || 'Otro',
  assistants: params.assistants || {
    expected: 1000,
    actual: 10
  },
  notifications: params.notification || [{
    tag: 'creation',
    author: stubOwner
  }],
  feedback: params.feedback || 'It was a blast!',
  speakers: params.speakers || [{
      firstName: 'geralt',
      lastName: 'white wolf',
      email: 'geralt@kaermorhen.pl'
    },
    {
      firstName: 'yennefer',
      lastName: 'vengerberg',
      email: 'yen@aedirn.pl'
    }
  ]
});

events.eventStubWithId = (params, id = 'EVENT_ID') => {
  const stub = events.eventStub(params);
  stub.id = id;
  stub._id = id;
  return stub;
};

events.userStub = (params = {}) => ({
  firstName: params.firstName || 'Tomas',
  lastName: params.lastName || 'Cerda',
  fullName: params.fullName || '',
  email: params.email || 'tomas.cerda@ibm.com',
  uid: params.uid || '063329',
  _id: params.uid || '063329',
  isAdmin: params.isAdmin || true
});

// WARNING: mutable function
events.select = params => (
  params.map(e => {
    e.feedback = undefined;
    e.category = undefined;
    e.speakers = undefined;
    e.notifications = undefined;
    return e;
  })
);

events.insert = (...params) => Promise.all(params.map(e => Event.create(events.eventStub(e))));

module.exports = events;