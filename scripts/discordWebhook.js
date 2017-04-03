const dotenv = require('dotenv').config({
    path: './credentials/.env'
  }),
  request = require('request');

config = {
  url: process.env.DC_WEBHOOK_URL
};

function msgDiscord(message) {
  request({
    method: 'POST',
    url: config.url,
    json: {
      "content": message,
    }
  });
}

module.exports = {
  msgDiscord
}