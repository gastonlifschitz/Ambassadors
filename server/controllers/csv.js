const logger = require('log4js').getLogger('CsvController');
const Event = require('../model/events');
const Subscriber = require('../model/subscribers');
const responseService = require('../services/response');
const json2csv = require('json2csv').parse;
const moment = require('moment');

const ctrl = {};

logger.setLevel(process.env.LOG_LEVEL || 'debug');

const DELIMITER = '|';

const eventsCsvOptions = {
  fields: [{
      label: 'Nombre',
      value: 'name'
    },
    {
      label: 'Embajador',
      value: 'owner.fullName'
    },
    {
      label: 'Mail del embajador',
      value: 'owner.email'
    },
    {
      label: 'Colaboradores',
      value: 'speakers'
    },
    {
      label: 'Institución',
      value: 'location.institution'
    },
    {
      label: 'Dirección',
      value: 'location.address'
    },
    {
      label: 'Asistentes',
      value: 'assistants'
    },
    {
      label: 'Categoría',
      value: 'category'
    },
    {
      label: 'Fecha',
      value: 'date'
    },
    {
      label: 'Estado',
      value: 'state'
    }
  ],
  delimiter: DELIMITER,
  quote: ''
};

const csvSeparator = DELIMITER;

const stateToSpanish = {
  scheduled: 'EN REVISION',
  approved: 'PROXIMO',
  completed: 'FINALIZADO',
  cancelled: 'CANCELADO'
};

const getState = event => {
  const now = new Date();
  const spanishState = stateToSpanish[event.state];

  if (event.state !== 'approved')
    return spanishState;

  if (event.date < now)
    return 'FALTA COMPLETAR';

  return spanishState;
};

ctrl.getEventsCsv = async (req, res) => {
  try {
    logger.debug('Sending events CSV');
    let events = await Event
      .find()
      .where('state').ne('cancelled')
      .select('-description -feedback -notifications');

    events = events.map(e => {
      e = e.toJSON();
      e.state = getState(e);
      e.date = moment(e.date).utcOffset(-180).format('DD/MM/YYYY');
      e.speakers = e.speakers.map(s => s.fullName).join(', ');
      e.assistants = e.assistants.actual ? e.assistants.actual : e.assistants.expected;
      return e;
    });

    const csv = json2csv(events, eventsCsvOptions);
    responseService.csv(res, csv, csvSeparator);
  } catch (err) {
    logger.error(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

const subscribersCsvOptions = {
  fields: [{
      label: 'Email',
      value: 'user.email'
    },
    {
      label: 'Nombre',
      value: 'user.fullName'
    },
    {
      label: 'Skills',
      value: 'skills'
    },
    {
      label: 'Intereses',
      value: 'interests'
    }
  ],
  delimiter: DELIMITER,
  quote: ''
};

ctrl.getSubscribersCsv = async (req, res) => {
  try {
    logger.debug('Sending subscribers CSV');
    const subs = await Subscriber.find();
    const csv = json2csv(subs, subscribersCsvOptions);
    responseService.csv(res, csv, csvSeparator);
  } catch (err) {
    logger.error(err.message);
    responseService.json(res, 400, {
      message: err.message
    });
  }
};

module.exports = ctrl;