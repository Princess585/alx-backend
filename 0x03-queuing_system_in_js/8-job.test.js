#!/usr/bin/yarn test

import kue from 'kue';
import chai from 'chai';
import createPushNotificationsJobs from './8-job.js';

const { expect } = chai;

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw(Error, 'Jobs is not an array');
  });

  it('should create two new jobs in the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    const jobIds = queue.testMode.jobs.map(job => job.id);
    expect(jobIds).to.have.lengthOf(2);
    expect(jobIds).to.include.members([1, 2]);
  });

  it('should log job creation messages', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      }
    ];
    const consoleLogSpy = chai.spy.on(console, 'log');

    createPushNotificationsJobs(jobs, queue);

    expect(consoleLogSpy).to.have.been.called.with('Notification job created: 1');

    chai.spy.restore(console, 'log');
  });
});

