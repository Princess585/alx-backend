#!/usr/bin/yarn dev
import { createQueue } from 'kue';

const queue = kue.createQueue();

const job = queue.create('push_notification_code', {
  phoneNumber: '0729206379',
  message: 'Notify me',
});

job
  .on('enqueue', () => {
    console.log('Notification job created:', job.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed', () => {
    console.log('Notification job failed');
  });
job.save();
