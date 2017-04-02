const fs = require('fs');
const colors = require('colors');
const database = require('./store/lowdb');
const discord = require('./discordWebhook');



const config = {
  targetSubreddit: 'Rainbow6',
  queryLimit: 50,
  messageText: fs.readFileSync('./plaintext/message.txt').toString(),
  flair: {
    class: 'redditall',
    text: 'r/all'
  }
};

function processPost(postID) {
  r.getSubmission(postID)
    .assignFlair({ text: config.flair.text, cssClass: config.flair.class })
    .reply(config.messageText).then(comment => {
      r.getComment(comment)
        .distinguish({ status: true, sticky: true }).then(() => {
          console.log(`...(${postID}) flair set to .linkflair-${config.flair.class} 
              ...(text: "${config.flair.text}")\n`.green);
        });
    });
}

module.exports = {
  loopAll: function () {
    console.log(` TARGET `.bgBlue.black + ` r/${config.targetSubreddit}`.blue + `\n`);
    r.getHot('all', {limit: config.queryLimit}).map(post => post).then(post => {
      let count = 0;
      for (let i in post) {
        count++;
        if (post[i].subreddit.display_name == config.targetSubreddit) {
          console.log(` MATCH `.bgGreen.black + ` (${post[i].id}) matching target subreddit (r/${config.targetSubreddit})`.green);
          if (database.isSaved(post[i].id) === false) {
            console.log(`...we haven't seen this before!`.green);
            database.saveToDB({
              id: post[i].id,
              title: post[i].title,
              is_self: post[i].is_self,
              score: post[i].score,
              logged: new Date().toString()
            });
            processPost(post[i].id);
            discord.msgDiscord(`Saw r/${config.targetSubreddit} post on r/all just now. It has score of ${post[i].score}. Trying to flair & comment.`);            
          } else {
            console.log(`...we already got this covered!\n`.yellow);
          }
        }
      }
    });
  }
};