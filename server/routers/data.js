const express = require('express');
const router = express.Router();
const csvCtrl = require('../controllers/csv');

router.get('/subscribers.csv', csvCtrl.getSubscribersCsv);
router.get('/events.csv', csvCtrl.getEventsCsv);

module.exports = router;
