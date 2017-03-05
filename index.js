require('dotenv').config({path: './credentials/.env'});
fs = require('fs');
snoowrap = require('snoowrap');
CronJob = require('cron').CronJob;
r6bot = require('./scripts/r6bot.js');

function handleJobs(object) {
  r6bot.loopAll();
  new CronJob('1 * * * * *', function() {
    r6bot.loopAll();
  }, null, true);
}

handleJobs({r6bot: r6bot});