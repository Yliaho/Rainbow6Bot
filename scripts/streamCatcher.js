const twitchApi = require('twitch-api');
const dotenv = require('dotenv').config({ path: './credentials/.env' });

const config = {
  targetChannels: [
    'rainbow6',
    'esl_r6s',
    // 'ogn_ow'
  ],
  popup: {
    targetSubreddit: 'Rainbow6',
    body(channel) {
      return {
        text: `${channel.channelName} is streaming on Twitch!`,
        cta: `[watch now](${channel.url})`
      };
    }
  },
  isLive: false
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
        if (err) {reject(err); return;}

        if (data.stream !== null) {
          resolve({
            channelName: data.stream.channel.display_name,
            url: data.stream.channel.url,
            streaming: {
              game: data.stream.game,
              status: data.stream.channel.status
            }
          });
        } else if (i === config.targetChannels.length - 1) {
          resolve(null);
        }
      });
    }
  });
}

async function processSidebar(method, context) {
  const sideMd = await r.getSubreddit(config.popup.targetSubreddit).getWikiPage('config/sidebar').content_md;
  if (method === 'add') {
    const popupMd = 
`####[](#popup)  
  * *${config.popup.body(context).text}*  
  ${config.popup.body(context).cta}  
  
`;
    r.getSubreddit(config.popup.targetSubreddit).getWikiPage('config/sidebar').edit({
      text: popupMd.concat(sideMd)
    }).catch(err => { console.log(err); });
  } else if (method === 'remove') {
    r.getSubreddit(config.popup.targetSubreddit).getWikiPage('config/sidebar').edit({
      text: sideMd.slice(sideMd.indexOf('>####[](#FEATURED LINKS)'))
    }).catch(err => { console.log(err); });
  }
}

  
function doTwitch() {
  getTargetStreams().then(body => {
    if (body) {
      processSidebar('add', body);
      config.isLive = true;
    } else if (!body && config.isLive === true) {
      processSidebar('remove');
      config.isLive = false;
    } else {
      config.isLive = false;
    }
  });
}

module.exports = {
  doTwitch
};