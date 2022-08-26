const schedule = require('node-schedule');
const scheduler = require('../../services/scheduler');
const sinon = require('sinon');

describe('Scheduler test', () => {
  let jobSpy;
  let clock;

  beforeEach(() => {
    jobSpy = { cancel: sinon.spy() };
    sinon.stub(schedule, 'scheduleJob').callsFake((date, callback) => {
      setTimeout(callback, 500);
      return jobSpy;      
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    schedule.scheduleJob.restore();
  });

  it('should schedule a callback given a date and id', () => {
    expect(scheduler.isScheduled('AN_ID')).toBe(false);
    scheduler.schedule(new Date(), 'AN_ID', () => {});
    sinon.assert.calledOnce(schedule.scheduleJob);
    expect(scheduler.isScheduled('AN_ID')).toBe(true);
  });

  it('should cancel given two schedules with same id', () => {
    expect(scheduler.isScheduled('ID')).toBe(false);
    scheduler.schedule(new Date(), 'ID', () => {});

    expect(scheduler.isScheduled('ID')).toBe(true);
    scheduler.schedule(new Date(), 'ID', () => {});

    sinon.assert.calledOnce(jobSpy.cancel);
    expect(scheduler.isScheduled('ID')).toBe(true);
  });

  it('should cancel an schedule given its id', () => {
    expect(scheduler.isScheduled('another id')).toBe(false);
    scheduler.schedule(new Date(), 'another id', () => {});
    expect(scheduler.isScheduled('another id')).toBe(true);
    scheduler.cancel('another id');
    expect(scheduler.isScheduled('another id')).toBe(false);
  });

  it('should accept two schedules with same id provided the first one has executed', () => {
    expect(scheduler.isScheduled('id')).toBe(false);

    scheduler.schedule(new Date(), 'id', () => {});

    clock.tick(501);

    expect(scheduler.isScheduled('id')).toBe(false);

    scheduler.schedule(new Date(), 'id', () => {});

    expect(scheduler.isScheduled('id')).toBe(true);

    sinon.assert.notCalled(jobSpy.cancel);
  });
});
