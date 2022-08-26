const logger = require('log4js').getLogger('EventsController');
const moment = require('moment');
const Event = require('../model/events');
const responseService = require('../services/response');
const notificationService = require('../services/notification');
const linkService = require('../services/link');
const ctrl = {};

logger.setLevel(process.env.LOG_LEVEL || 'debug');

const PER_PAGE = 25;

const findEventsQuery = ({
  minDate,
  maxDate,
  state,
  excludeState,
  uid,
  order
}) => {
  let query = Event.find();

  if (minDate)
    query = query.where('date').gte(minDate);
  if (maxDate)
    query = query.where('date').lte(maxDate);
  if (state)
    query = query.where('state').equals(state);
  if (excludeState)
    query = query.where('state').ne(excludeState);
  if (uid)
    query = query.where('owner._id').equals(uid);

  if (order && (order === 'asc' || order === 'desc'))
    query = order === 'asc' ? query.sort('date') : query.sort('-date');

  return query;
};

ctrl.listEvents = async (req, res) => {
  try {
    let {
      page,
      per_page: perPage
    } = req.query;

    page = page ? parseInt(page) : 1;
    perPage = perPage ? parseInt(perPage) : PER_PAGE;

    logger.debug(`Listing events - Page ${page}`);

    const [events, count] = await Promise.all([
      findEventsQuery(req.query)
      .select('-feedback -speakers -category -notifications')
      .skip((page - 1) * perPage)
      .limit(perPage),

      findEventsQuery(req.query)
      .select('-feedback -speakers -category -notifications')
      .count()
    ]);

    const maxPage = Math.ceil(count / perPage);

    res.set('Link', linkService.build(req, parseInt(page), maxPage));

    responseService.json(res, 200, events);
  } catch (err) {
    logger.error(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};


ctrl.getEvent = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    logger.debug(`Retrieving event ${id}`);
    const event = await Event.findById(id);

    if (!event)
      throw Error(`Event with id ${id} not found`);

    responseService.json(res, 200, event);
  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 404, {
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

ctrl.createEvent = async (req, res) => {
  try {
    const event = req.body;
    const {
      user
    } = req;

    event.owner = userToSchema(user);

    logger.info(`Creating event ${event.name} by user ${user.fullName}`);
    logger.info(`Estado ${event.state}`)

    event.notifications = [{
      tag: 'creation',
      author: event.owner
    }];


    const created = await Event.create(event);

    notificationService.notifyCreated(created);
    responseService.json(res, 201, created);
  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

ctrl.editEvent = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      user
    } = req;
    const event = req.body;

    logger.info(`Editting event ${id}`);

    const oldEvent = await Event.findById(id);

    if (!oldEvent) {
      const message = `Event with id ${id} not found for editting`;
      logger.warn(message);
      responseService.json(res, 404, {
        message
      });
      return;
    }

    if (user.uid !== oldEvent.owner.uid && !user.isAdmin) {
      logger.warn(`Forbidden event owner uid ${user.uid} editing event ${oldEvent.id}`);
      responseService.json(res, 403, {
        message: 'Forbidden to edit event. Not owner nor admin.'
      });
      return;
    }

    event.notifications = oldEvent.notifications;
    event.notifications.push({
      tag: 'edit',
      author: userToSchema(user)
    });

    const edittedEvent = await Event.findByIdAndUpdate(id, event, {
      new: true
    });

    // Attempt to reschedule or send event end notification only if the date day was editted
    if (!moment(edittedEvent.date).isSame(oldEvent.date, 'day'))
      notificationService.scheduleEventEnd(edittedEvent);

    // Should not send notification if the edition was submitted by an admin
    if (!req.user.isAdmin)
      notificationService.notifyEditted(oldEvent.toJSON(), edittedEvent.toJSON());

    responseService.json(res, 200, edittedEvent);
  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

const stateToTagMap = {
  scheduled: 'revision',
  approved: 'approval',
  completed: 'completion',
  cancelled: 'cancellation'
};

const isTagWithDescription = tag => tag === 'revision' || tag === 'approval' || tag === 'cancellation';

ctrl.setState = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      user
    } = req;
    const {
      state,
      message,
      feedback,
      actualAssistants,
      speakers
    } = req.body;

    if (!state)
      throw Error('Missing state');

    const event = await Event.findById(id);

    if (!event) {
      const message = `Event with id ${id} not found for setting state`;
      responseService.json(res, 404, {
        message
      });
      return;
    }

    if (user.uid !== event.owner.uid && !user.isAdmin) {
      logger.warn(`Forbidden event owner uid ${user.uid} setting state of event ${event.id}`);
      responseService.json(res, 403, {
        message: `Forbidden to set state ${state}. Not owner nor admin.`
      });
      return;
    }

    logger.info(`Setting state ${state} to event ${id}`);
    event.state = state;

    const tag = stateToTagMap[state];
    const notification = {
      tag,
      author: userToSchema(user)
    };

    if (isTagWithDescription(tag))
      notification.description = message;

    event.notifications.push(notification);

    if (feedback)
      event.feedback = feedback;

    if (speakers)
      event.speakers = speakers;

    if (actualAssistants)
      event.assistants.actual = actualAssistants;

    const edittedEvent = await event.save();

    notificationService.notifyState(edittedEvent, message);
    responseService.json(res, 200, edittedEvent);
  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

ctrl.deleteEvent = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const event = await Event.findById(id);

    logger.info(`Deleting event ${id}`);

    if (!event) {
      responseService.json(res, 204, {});
      return;
    }

    if (req.user.uid !== event.owner.uid && !req.user.isAdmin) {
      logger.warn(`Forbidden event owner uid ${req.user.uid} deleting event ${event.id}`);
      responseService.json(res, 403, {
        message: 'Foridden to delete event. Not owner nor admin.'
      });
      return;
    }

    await Event.findByIdAndRemove(id);

    notificationService.notifyEventDeleted(event);
    responseService.json(res, 204, {});
  } catch (err) {
    logger.warn(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

module.exports = ctrl;