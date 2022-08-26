const schedule = require('node-schedule');
const moment = require('moment');
const logger = require('log4js').getLogger('SchedulerService');
const jobs = {};
const service = {};

logger.setLevel(process.env.LOG_LEVEL || 'debug');

service.schedule = (date, id, callback, repeatInterval) => {
  const today = moment();

  if (moment(date).isBefore(today)) {
    logger.info(`Executing immediately job with id ${id} since schedule date it's in the past`);
    callback();

    if (repeatInterval)
      service.schedule(moment(today).add(repeatInterval).toDate(), id, callback, repeatInterval);
  }
  else {
    const job = schedule.scheduleJob(date, () => {
      delete jobs[id];
      callback();

      if (repeatInterval)
        service.schedule(moment(date).add(repeatInterval).toDate(), id, callback, repeatInterval);
    });

    if (service.isScheduled(id))
      service.cancel(id);
    
    logger.info(`Scheduling job with id ${id}`);
    jobs[id] = job;    
  }
};

service.cancel = id => {
  if (service.isScheduled(id)) {
    logger.info(`Cancelling job with id ${id}`);
    jobs[id].cancel();
    delete jobs[id];
  }
};

service.isScheduled = id => !!jobs[id];

module.exports = service;
