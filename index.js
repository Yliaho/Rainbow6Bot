snoowrap = require('snoowrap');
const r6all = require('./scripts/r6bot.js');
const discordBot = require('./scripts/discordBot.js'); 

r = new snoowrap({
  userAgent:    process.env.SW_USER_AGENT,
  clientId:     process.env.SW_BOT_ID,
  clientSecret: process.env.SW_SECRET,
  username:     process.env.SW_USER,
  password:     process.env.SW_PASSWORD
});

discordBot.client.login(process.env.DC_TOKEN);

r.config({
  requestDelay: 1000,
  debug: false
});

r6all.loopAll();

// // do the jobs here
// setInterval(() => {
//   r6all.loopAll();
// }, 60000);
