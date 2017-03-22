const dotenv = require('dotenv').config({ path: './credentials/.env' });
snoowrap = require('snoowrap');
const r6all = require('./scripts/r6all');
const eventTimer = require('./scripts/event-timer');
// const moment = require('moment-timezone');
const database = require('./scripts/store/pouch');
import moment from 'moment-timezone';

// r = new snoowrap({
//   userAgent:    process.env.SW_USER_AGENT,
//   clientId:     process.env.SW_BOT_ID,
//   clientSecret: process.env.SW_SECRET,
//   username:     process.env.SW_USER,
//   password:     process.env.SW_PASSWORD
// });

// r.config({
//   requestDelay: 1000,
//   debug: true
// });

database.isSaved('kakka')

// eventTimer.eventHandler(moment());
// // r6all.loopAll();
// // setInterval(() => {
// //   eventTimer.eventHandler(moment());
// // }, 60000);
