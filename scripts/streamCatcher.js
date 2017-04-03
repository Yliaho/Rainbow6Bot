const dotenv = require('dotenv').config({
  path: './credentials/.env'
});
const twitchApi = require('twitch-api');
const snoowrap = require('snoowrap');
const discord = require('./discordWebhook');

const config = {
  targetChannels: [
    'rainbow6',
    // 'esl_r6s',
    'iwilldominate'
  ],
  popup: {
    targetSubreddit: 'r6moderatorscsstest',
    body(channel) {
      return {
        text: `${channel.channelName} is streaming on Twitch!`,
        cta: `[watch now](${channel.url})`
      };
    },
    sliceIndex: '>####[](#FEATURED LINKS)'
  },
  isLive: false,
};

const twitch = new twitchApi({
  clientId: process.env.TW_CLIENT_ID,
  clientSecret: process.env.TW_CLIENT_SECRET,
  redirectUri: 'http://localhost',
  scopes: []
});


function getTargetStreams() {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < config.targetChannels.length; i++) {
      twitch.getChannelStream(config.targetChannels[i], (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        if (data.stream !== null) {
          resolve({
            channelName: data.stream.channel.display_name,
            url: data.stream.channel.url,
            streaming: {
              game: data.stream.game,
              status: data.stream.channel.status,
            }
          });
        } else if (i === config.targetChannels.length - 1) {
          resolve(null);
        }
      });
    }
  });
}

function sliceFromSidebar(target) {
  if (target.indexOf(config.popup.sliceIndex) != -1) {
    return target.slice(target.indexOf(config.popup.sliceIndex));
  } else {
    discord.msgDiscord(`I couldn't remove the pop-up from the sidebar! The format must be invalid...`);
    return target;
  }
}

async function processSidebar(method, context) {
  const sideMd = await r.getSubreddit(config.popup.targetSubreddit).getWikiPage('config/sidebar').content_md;
  if (method === 'add') {
    const popupMd = [
      `####[](#popup)  \n`,
      `* *${config.popup.body(context).text}*  \n`,
      `${config.popup.body(context).cta}  \n  \n`,
    ];
    
    console.log(popupMd);
    r.getSubreddit(config.popup.targetSubreddit).getWikiPage('config/sidebar').edit({
        text: popupMd.join(" ").concat(sideMd)
    })
      .then(discord.msgDiscord(`I updated the sidebar with pop-up.`))
      .catch(err => {
        console.log(err);
      });
  } else if (method === 'remove') {
    r.getSubreddit(config.popup.targetSubreddit).getWikiPage('config/sidebar').edit({
        text: sliceFromSidebar(sideMd)
    })
      .then(result => {
        if (sideMd.indexOf(config.popup.sliceIndex) != -1) {
          discord.msgDiscord(`Removed the pop-up. Until next time! :)`)
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function doTwitch() {
  getTargetStreams().then(body => {
    if (body && config.isLive === false) {
      processSidebar('add', body);
      config.isLive = true;
      discord.msgDiscord(`${body.channelName} just went live on Twitch...`);
      console.log('found stream and added to sidebar. state set to: ' + config.isLive);
    } else if (!body && config.isLive === true) {
      processSidebar('remove');
      config.isLive = false;
      discord.msgDiscord(`Stream has finished...`);
      console.log('no stream found. state set to: ' + config.isLive);
    } else if (config.isLive === true) {
      console.log('we are still live. state is still: ' + config.isLive);
    } else {
      config.isLive = false;
    }
  });
}

module.exports = {
  doTwitch,
  config,
  getTargetStreams,
  processSidebar
};