const fs = require('fs');
const colors = require('colors');

const config = {
  targetSubreddit: 'Rainbow6',
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
              `...(${postID}) flair set to .linkflair-${config.flair.class}`.green +
              `...(text: "${config.flair.text}")`.green
              );
            });
      });
}

module.exports = {
  loopAll() {
    console.log(` TARGET `.bgBlue.black + ` r/${config.targetSubreddit}`.blue);
    r.getHot('all', { limit: config.queryLimit}).then(post => {
      console.log(`...current r/all top post: `.blue + `${post[0].title}`);
      let count = 0;
      for (let i in post) {
        count++;
        if (post[i].subreddit.display_name == config.targetSubreddit) {
          console.log(` MATCH `.bgGreen.black + ` (${post[i].id}) matching target subreddit (r/${config.targetSubreddit})`.green);
          if (post[i].link_flair_css_class != config.flair.class) {
            console.log(`...we haven't seen this before!`.green);
            processPost(post[i].id);
          } else {
            console.log(`...it's old`.yellow);
          }
        } else if (count >= post.length && post[i].subreddit.display_name != config.targetSubreddit) {
          console.log(`...no posts found matching target subreddit (r/${config.targetSubreddit})`.blue);
          break;
        }
      }
    })
    .catch(err => {
      console.error(` ERROR `.bgRed.black + ` ${err.statusCode} ${err.statusMessage}`.red);
    }); 
  }
};