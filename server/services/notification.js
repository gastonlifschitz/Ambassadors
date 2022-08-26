/* eslint newline-per-chained-call: 0 */

const logger = require("log4js").getLogger("NotificationService");
const {
  diff
} = require("deep-diff");
const moment = require("moment");
const scheduler = require("./scheduler");
const Event = require("../model/events");
const Subscriber = require("../model/subscribers");
const emailService = require("./email");
const emailBuilder = require("./emailBuilder");
const service = {};

const receptor = process.env.RECEPTOR_MAIL || "";
const SCHEDULE_HOUR = 10;
const UTC_OFFSET = -180;
const REPEAT_INTERVAL = {
  days: 3
};

logger.setLevel(process.env.LOG_LEVEL || "debug");

service.scheduleHour = SCHEDULE_HOUR;
service.repeatInterval = REPEAT_INTERVAL;

const isAfterSchedule = () =>
  moment().utcOffset(UTC_OFFSET).hours() > SCHEDULE_HOUR;

service.restoreScheduledNotifications = async () => {
  logger.info("Restoring scheduled notifications");
  const events = await Event.find()
    .where("date")
    .where("state")
    .equals("approved");

  events.forEach((event) => service.scheduleEventEnd(event));
};

service.notifySubscribed = async (subscriber) => {
  const {
    user
  } = subscriber;
  const emailSubscribed = emailBuilder.userSubscribed(subscriber);

  try {
    logger.info(`Sending subscription notification to ${user.email}`);

    await emailService.sendEmail(
      emailSubscribed.title,
      user.email,
      emailSubscribed.content
    );
  } catch (err) {
    logger.error(`Failed to send notification: ${err.message}`);
  }
};

service.notifyCreated = async (event) => {
  const {
    owner
  } = event;
  const emailCreatedAdmin = emailBuilder.eventCreatedAdmin(event);
  const emailCreated = emailBuilder.eventCreated(event);

  try {
    logger.info(`Sending created notification for event ${event.id}`);
    await Promise.all([
      emailService.sendEmail(
        emailCreatedAdmin.title,
        receptor,
        emailCreatedAdmin.content
      ),
      emailService.sendEmail(
        emailCreated.title,
        owner.email,
        emailCreated.content
      ),
    ]);
    logger.info(
      `Created notification for event ${event.id} sent to ambassadors and admins`
    );
  } catch (err) {
    logger.error(`Failed to send notification: ${err.message}`);
  }
};

// TODO_1: Fijarse que devueve el diff de mi servicio y chequear que sea coherente.

service.notifyEditted = async (prevEvent, newEvent) => {
  logger.info(`Sending notification for editted event ${newEvent.id}`);

  try {
    // console.log(prevEvent);
    // console.log(newEvent);
    const differences = diff(prevEvent, newEvent);
    // console.log(differences);
    // const newDifferences = diffService.differences(prevEvent, newEvent, false);
    // console.log(newDifferences);
    const emailEditted = emailBuilder.eventEditted(
      newEvent,
      differences,
      prevEvent.speakers
    );

    await emailService.sendEmail(
      emailEditted.title,
      receptor,
      emailEditted.content
    );
    logger.info(`Editted notification sent for event ${newEvent.id}`);
  } catch (err) {
    logger.error(`Failed to send editted notification: ${err.message}`);
  }
};

service.scheduleEventEnd = (event) => {
  if (shouldScheduleEvent(event)) {
    const tomorrowScheduleTime = moment(event.date)
      .utcOffset(UTC_OFFSET)
      .add(1, "days")
      .hours(SCHEDULE_HOUR)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);

    logger.info(
      `Scheduling event end notification ${event.id} for date ${tomorrowScheduleTime}`
    );

    scheduleThenRepeat(
      tomorrowScheduleTime.toDate(),
      event.id,
      () => notifyFinishedEvent(event.id),
      () => notifyFinishedEvent(event.id, true),
      REPEAT_INTERVAL
    );
  } else if (event.state === "approved") {
    if (scheduler.isScheduled(event.id)) scheduler.cancel(event.id);

    scheduleReminder(event);
  }
};

const scheduleThenRepeat = (
  date,
  id,
  callback,
  repeatableCallback,
  repeatInterval
) => {
  scheduler.schedule(date, id, () => {
    callback();
    scheduler.schedule(
      moment(date).add(repeatInterval).toDate(),
      id,
      repeatableCallback,
      repeatInterval
    );
  });
};

const scheduleReminder = (event) => {
  const reminders = event.notifications.filter(
    (n) => n.tag === "completionReminder"
  );
  const len = reminders.length;
  const lastReminder = len > 0 ? reminders[len - 1] : null;
  const date = lastReminder ? lastReminder.timestamp : new Date();

  const repeatDate = moment(date)
    .utcOffset(UTC_OFFSET)
    .add(REPEAT_INTERVAL)
    .hours(SCHEDULE_HOUR)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .toDate();

  logger.info(
    `Scheduling completion reminder notification ${event.id} for date ${repeatDate}`
  );

  scheduler.schedule(
    repeatDate,
    event.id,
    () => notifyFinishedEvent(event.id, true),
    REPEAT_INTERVAL
  );
};

const shouldScheduleEvent = (event) => {
  const eventDate = moment(event.date).utcOffset(UTC_OFFSET);
  const yesterday = moment().utcOffset(UTC_OFFSET).subtract(1, "days");
  const wasBeforeYesterday = eventDate.isBefore(yesterday, "day");
  const wasYesterday = eventDate.isSame(yesterday, "day");

  if (wasBeforeYesterday) return false;

  if (isAfterSchedule() && wasYesterday) return false;

  return event.state === "approved";
};

const notifyFinishedEvent = async (eventId, skipAdmins) => {
  logger.info(`Sending event end notification email for event ${eventId}`);

  try {
    const event = await Event.findById(eventId);

    const {
      owner
    } = event;
    const emailFinishAdmin = emailBuilder.eventFinishedAdmin(event);
    const emailFinish = emailBuilder.eventFinished(event);

    event.notifications.push({
      tag: "completionReminder"
    });
    await event.save();

    if (skipAdmins) {
      emailService.sendEmail(
        emailFinish.title,
        owner.email,
        emailFinish.content
      );
    } else {
      await Promise.all([
        emailService.sendEmail(
          emailFinishAdmin.title,
          receptor,
          emailFinishAdmin.content
        ),
        emailService.sendEmail(
          emailFinish.title,
          owner.email,
          emailFinish.content
        ),
      ]);
    }
  } catch (err) {
    logger.error(
      `Failed to send notification emails for event ${event.id}, ${err.message}`
    );
  }
};

service.notifyEventDeleted = async (event) => {
  logger.info(`Sending event deleted notification for event ${event.name}`);
  const emailDeleted = emailBuilder.eventDeleted(event);

  if (scheduler.isScheduled(event.id)) scheduler.cancel(event.id);

  try {
    await emailService.sendEmail(
      emailDeleted.title,
      receptor,
      emailDeleted.content
    );
    logger.info(`Event deleted notification sent for event ${event.name}`);
  } catch (err) {
    logger.error(`Failed to send deleted notification: ${err.message}`);
  }
};

service.notifyState = async (event, message) => {
  try {
    logger.info(
      `Sending state notification for state ${event.state} and event ${event.id}`
    );
    const notifier = stateNotifiers[event.state];
    await notifier(event, message);
    logger.info(
      `State notification for state ${event.state} and event ${event.id} sent`
    );
  } catch (err) {
    logger.error(
      `Failed to send notification for state change to: ${event.state}, ${err.message}`
    );
  }
};

const notifyApproved = (event, message) => {
  const {
    owner
  } = event;
  const {
    eventApproved,
    eventApprovedFinished
  } = emailBuilder;
  const emailApproved = shouldScheduleEvent(event) ?
    eventApproved(event, message) :
    eventApprovedFinished(event, message);

  service.scheduleEventEnd(event);

  return emailService.sendEmail(
    emailApproved.title,
    owner.email,
    emailApproved.content
  );
};

const notifyCompleted = (event, message) => {
  const emailCompleted = emailBuilder.eventCompleted(event, message);

  scheduler.cancel(event.id);

  return emailService.sendEmail(
    emailCompleted.title,
    receptor,
    emailCompleted.content
  );
};

const notifyRejected = (event, message) => {
  const {
    owner
  } = event;
  const emailRejected = emailBuilder.eventRejected(event, message);
  return emailService.sendEmail(
    emailRejected.title,
    owner.email,
    emailRejected.content
  );
};

const notifyCancelled = (event, message) => {
  const {
    owner
  } = event;
  const emailCancelled = emailBuilder.eventCancelled(event, message);

  scheduler.cancel(event.id);

  return emailService.sendEmail(
    emailCancelled.title,
    owner.email,
    emailCancelled.content
  );
};

const stateNotifiers = {
  approved: notifyApproved,
  completed: notifyCompleted,
  scheduled: notifyRejected,
  cancelled: notifyCancelled,
};

const UPCOMING_NOTIF_DATE = 15;

service.notifyUpcomingEvents = () => {
  const today = moment().utcOffset(UTC_OFFSET);
  const day = today.date();

  let nextDate = moment(today); // clone date since moment is mutable

  nextDate =
    day >= 1 && day < UPCOMING_NOTIF_DATE ?
    nextDate.date(UPCOMING_NOTIF_DATE) :
    nextDate.add(1, "M").date(1);

  nextDate.hours(SCHEDULE_HOUR).minutes(0).seconds(0).milliseconds(0);

  logger.info(
    `Scheduling upcoming events notification for ${nextDate.toDate()}`
  );

  scheduler.schedule(
    nextDate.toDate(),
    "upcoming_events",
    service.notifyUpcomingEvents
  );

  if (day === 1 || day === UPCOMING_NOTIF_DATE)
    sendUpcomingEventsNotification(today, nextDate);
};

const sendUpcomingEventsNotification = async (today, nextDate) => {
  const events = await Event.find()
    .where("state")
    .equals("approved")
    .where("date")
    .gt(today.toDate())
    .where("date")
    .lte(nextDate.toDate())
    .sort("date")
    .select(
      "-feedback -speakers -notifications -state -description -assistants"
    );

  if (events.length > 0) {
    logger.info("Sending upcoming events notification");

    const emailUpcomingEvents = emailBuilder.upcomingEvents(events);
    const subscribers = await Subscriber.find().select("user");
    const subscribersEmail = subscribers.map((s) => s.user.email);

    try {
      await emailService.sendBccEmail(
        emailUpcomingEvents.title,
        subscribersEmail,
        emailUpcomingEvents.content
      );
      logger.info("Upcoming events notification sent");
    } catch (err) {
      logger.error(`Failed to send upcoming events notification: ${err}`);
    }
  } else {
    logger.info(
      `Not sending upcoming notification since there are no upcoming events until ${nextDate.toDate()}`
    );
  }
};

module.exports = service;