/* eslint-disable linebreak-style */
const express = require('express');
const router = express.Router();
const eventsCtrl = require('../controllers/events');
const subsCtrl = require('../controllers/subscribers');
const unSubsCtrl = require('../controllers/unsubscribers');


router.get('/events', eventsCtrl.listEvents);
router.get('/events/:id', eventsCtrl.getEvent);
router.put('/events/:id', eventsCtrl.editEvent);
router.post('/events', eventsCtrl.createEvent);
router.post('/events/:id/state', eventsCtrl.setState);
router.delete('/events/:id', eventsCtrl.deleteEvent);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  const authCtrl = require('../controllers/auth');

  router.get('/login', authCtrl.login);
  router.get('/metadata', authCtrl.metadata);
  router.post('/assert', authCtrl.assert);
}

router.get('/subscribers', subsCtrl.listSubscribers);
router.get('/subscribers/:id', subsCtrl.getSubscriber);
router.post('/subscribers', subsCtrl.addSubscriber);
router.delete('/subscribers/', subsCtrl.deleteSubscriber);

router.get('/unsubscribers', unSubsCtrl.listUnsubscribers);
router.get('/unsubscribers/:id', unSubsCtrl.getUnsubscriber);
router.post('/unsubscribers', unSubsCtrl.addUnsubscriber);
router.delete('/unsubscribers/:id', unSubsCtrl.deleteUnsubscriber);

module.exports = router;
