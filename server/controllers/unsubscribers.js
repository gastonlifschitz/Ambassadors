/* eslint-disable brace-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const logger = require('log4js').getLogger('UnsubscribersController');
const jwt = require('jsonwebtoken');
const Unsubscriber = require('../model/unsubscribers');
const Subscribers = require('../model/subscribers');
const responseService = require('../services/response');
const notificationService = require('../services/notification');
const ctrl = {};
logger.setLevel(process.env.LOG_LEVEL || 'debug');

const SubCtrl = require('./subscribers');


ctrl.listUnsubscribers = async (req, res) => {
    try {
        logger.debug('Listing unsubscribers');
        const subs = await Unsubscriber.find();
        responseService.json(res, 200, subs);
    } catch (err) {
        logger.error(err.message);
        responseService.json(res, 400, {
            message: err.message
        });
    }
};
ctrl.getUnsubscriber = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        logger.debug(`Retrieving unsubscriber ${id}`);
        const sub = await Unsubscriber.findById(id);
        if (!sub)
            throw Error(`Unsubscriber with id ${id} not found`);
        responseService.json(res, 200, sub);
    } catch (err) {
        logger.warn(err.message);
        responseService.json(res, 404, {
            message: err.message
        });
    }
};
ctrl.deleteUnsubscriber = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const sub = await Unsubscriber.findById(id);
        logger.info(`Deleting unsubscriber ${id}`);
        if (!sub) {
            responseService.json(res, 204, {});
            return;
        }
        if (req.user.uid !== sub.user.uid) {
            logger.warn(`Forbidden action to ${req.user.uid} from ${sub.user.uid}`);
            responseService.json(res, 403, {
                message: 'Forbidden to delete. Not the owner.'
            });
            return;
        }
        await Unsubscriber.findByIdAndRemove(id);

        responseService.json(res, 204, {});
    } catch (err) {
        logger.warn(err.message);
        responseService.json(res, 400, {
            message: err.message
        });
    }
};
const userToSchema = user => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    _id: user.uid
});

ctrl.addUnsubscriber = async (req, res) => {
    try {
        const {
            motive,
            id
        } = req.body;

        const sub = await Subscribers.findById(id);

        const user = userToSchema(sub.user);
        const newUnsub = {
            user,
            motive
        };

        logger.info(`Adding unsubscriber with id ${user._id} and email ${user.email}`);

        const deleted = await Unsubscriber.create(newUnsub);

        await SubCtrl.deleteSubscriber(req, res);

        const deletedJson = deleted.toJSON();
        deletedJson.token = jwt.sign({
            firstName: sub.user.firstName,
            lastName: sub.user.lastName,
            fullName: sub.user.fullName,
            email: sub.user.email,
            isAdmin: req.user.isAdmin,
            uid: sub.user.uid,
            isSubscriber: false
        }, process.env.JWT_SECRET);


        if (req.user.uid == sub.user.uid) {
            res.cookie('token', deletedJson.token);

        }

        responseService.json(res, 201, deletedJson);

    } catch (err) {
        logger.warn(err.message);
        responseService.json(res, 400, {
            message: err.message
        });
    }
};

module.exports = ctrl;