/* eslint-disable linebreak-style */
const logger = require('log4js').getLogger('SubscribersController');
const jwt = require('jsonwebtoken');
const Subscriber = require('../model/subscribers');
const responseService = require('../services/response');
const notificationService = require('../services/notification');
const ctrl = {};



logger.setLevel(process.env.LOG_LEVEL || 'debug');

ctrl.listSubscribers = async (req, res) => {
  try {
    logger.debug('Listing subscribers');
    const subs = await Subscriber.find();
    responseService.json(res, 200, subs);
  } catch (err) {
    logger.error(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

ctrl.getSubscriber = async (req, res) => {
  try {
    // eslint-disable-next-line linebreak-style
    const {
      id
    } = req.params;
    logger.debug(`Retrieving subscriber ${id}`);
    const sub = await Subscriber.findById(id);

    if (!sub)
      throw Error(`Subscriber with id ${id} not found`);

    responseService.json(res, 200, sub);
  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 404, {
      message: err.message
    });
  }
};

// Agregué opción de desuscribirse a uno mismo.

ctrl.deleteSubscriber = async (req, res) => {
  try {
    const {
      id
    } = req.body;
    const sub = await Subscriber.findById(id);

    if (!sub) {
      /* responseService.json(res, 204, {}); */
      return;
    }

    if (!req.user.isAdmin && req.user.uid != sub.user.uid) {
      logger.warn(`Forbidden subscriber uid ${req.user.uid} unsubscribing from ${sub.user.uid}`);
      /*  responseService.json(res, 403, { message: 'Forbidden to unsubscribe. Not an admin.' }); */
      return;
    }
    await Subscriber.findByIdAndRemove(id);

  } catch (err) {
    logger.warn(err.message);
    /* responseService.json(res, 400, { message: err.message }); */
  }
};


const userToSchema = user => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  _id: user.uid
});

ctrl.addSubscriber = async (req, res) => {
  try {
    const user = userToSchema(req.user);
    const {
      interests,
      skills
    } = req.body;
    const newSub = {
      user,
      interests,
      skills,
      _id: user._id
    };

    logger.info(`Adding subscriber with id ${user._id} and email ${user.email}`);

    const added = await Subscriber.create(newSub);
    notificationService.notifySubscribed(added);

    const addedJson = added.toJSON();
    addedJson.token = jwt.sign({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      fullName: req.user.cn,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      isSubscriber: true,
      uid: req.user.uid
    }, process.env.JWT_SECRET);

    res.cookie('token', addedJson.token);

    responseService.json(res, 201, addedJson);

  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

module.exports = ctrl;