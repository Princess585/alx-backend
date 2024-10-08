#!/usr/bin/yarn dev
import { createQueue } from 'kue';

const queue = createQueue();

function sendNotification = (phoneNumber, message) {
  console.log(
    `Sending notification to ${phoneNumber},`,
    'with message:',
    message,
  );
}

queue.process('push_notification_code', (job, done) => {
  sendNotification(phoneNumber, message);
  done();
});
