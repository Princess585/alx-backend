#!/usr/bin/yarn dev
import express = require('express');
import redis = require('redis');
import kue = require('kue');
import { promisify } = require('util');

const client = redis.createClient();
const reserveSeat = promisify(client.set).bind(client);
const getCurrentAvailableSeats = promisify(client.get).bind(client);
const queue = kue.createQueue();
const app = express();
const PORT = 1245;
let reservationEnabled = true;
const TOTAL_SEATS = 50;

reserveSeat('available_seats', TOTAL_SEATS);

app.get('/available_seats', async (req, res) => {
  try {
    const seats = await getCurrentAvailableSeats('available_seats');
    res.json({ numberOfAvailableSeats: seats });
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve available seats' });
  }
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    return res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats('available_seats');
    let seats = parseInt(availableSeats, 10);

    if (seats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    seats -= 1;
    await reserveSeat('available_seats', seats);

    if (seats === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

