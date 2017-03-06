dotenv = require('dotenv').config({path: './credentials/.env'});
fs = require('fs');
snoowrap = require('snoowrap');
CronJob = require('cron').CronJob;
colors = require('colors');
r6all = require('./scripts/r6bot.js');

global.r = new snoowrap({
  userAgent:    process.env.SW_USER_AGENT,
  clientId:     process.env.SW_CLIENT_ID,
  clientSecret: process.env.SW_SECRET,
  username:     process.env.SW_USER,
  password:     process.env.SW_PASSWORD
});

r.config({
  requestDelay: 1000,
  debug: false
});

// do the jobs here
setInterval(() => {
  r6all.loopAll();
}, 60000);