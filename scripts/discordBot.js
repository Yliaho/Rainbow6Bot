const Discord = require('discord.js');
const client = new Discord.Client();

const config = {
  targetDiscord: 'SloppysHideout',
  targetSubreddit: 'r6moderatorscsstest'
};

function getMembers(server) {
  console.log(server.presences.array().length);
}

client.on('ready', () =>{
  const servers = client.guilds.array();
  for (let i in servers) {
    if (servers[i].name == config.targetDiscord) {
      console.log(servers[i].member('238064667748990978').user.username);
    } else {
      console.log('no server found matching target');
    }
  }
}); 

module.exports = {
  client
};



