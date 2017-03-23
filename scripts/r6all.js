const fs = require('fs');
const colors = require('colors');
const database = require('./store/lowdb');

const config = {
  targetSubreddit: 'gaming',
  // how many posts from r/all do we want to fetch
  queryLimit: 50,
  messageText: fs.readFileSync('./plaintext/message.txt').toString(),
  flair: {
    class: 'redditall',
    text: 'r/all'
  }
};

function processPost(postID) {
  r.getSubmission(postID)
    .assignFlair({text: config.flair.text, cssClass: config.flair.class})
      .reply(config.messageText).then(comment => {
          r.getComment(comment)
            .distinguish({status: true, sticky: true}).then(() => {
              console.log(
              `...(${postID}) flair set to .linkflair-${config.flair.class}\n`.green +
              `...(text: "${config.flair.text}")`.green
              );
            });
      });
}

module.exports = {
  loopAll() {
    console.log(` TARGET `.bgBlue.black + ` r/${config.targetSubreddit} – searching r/all`.blue);
    r.getHot('all', { limit: config.queryLimit}).then(post => {
      console.log(`...current r/all top post: `.blue + `${post[0].title}`);
      let count = 0;
      for (let i in post) {
        count++;
        if (post[i].subreddit.display_name == config.targetSubreddit) {
          console.log(` MATCH `.bgGreen.black + ` (${post[i].id}) matching target subreddit (r/${config.targetSubreddit})`.green);
          if (database.isSaved(post[i].id) === false) {
            console.log(`...we haven't seen this before!`.green);
            // processPost(post[i].id);
            database.saveToDB({
              id:      post[i].id,
              title:   post[i].title,
              is_self: post[i].is_self,
              score:   post[i].score,
              logged:  new Date().toString()
            });
            break;
          } else if (database.isSaved(post[i].id) === true) {
            console.log(`...(${post[i].id}) is already covered!`.green);
            break;
          }
        } else if (count >= post.length) {
          break;
        }
      }
    })
    .catch(err => {
      console.error(` ERROR `.bgRed.black + ` ${err}`.red);
    }); 
  }
};