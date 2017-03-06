const config = {
  targetSubreddit: 'rainbow6',
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
              console.log(`...(${postID}) flair set to .linkflair-${config.flair.class} 
              ...(text: "${config.flair.text}")`);
            });
        });
}

module.exports = {
  loopAll: function() {
      console.log(` TARGET `.bgBlue.black + ` r/${config.targetSubreddit}`.blue + `\n`);
      r.getHot('all').map(post => post).then(post => {
        let count = 0;
        for (let i in post) {
          count++;
          if (post[i].subreddit.display_name == config.targetSubreddit) {
            console.log(` MATCH `.bgGreen.black + ` (${post[i].id}) matching target subreddit (r/${config.targetSubreddit})`);
            if (post[i].link_flair_css_class != config.flair.class) {
              console.log(`...we haven't seen this before!`);
              processPost(post[i].id);
            } else {
              console.log(`...it's old`);
            }
          } else if (count >= post.length && post[i].subreddit.display_name != config.targetSubreddit) {
            console.log(` NOPE `.bgYellow.black + ` no posts found matching target subreddit (r/${config.targetSubreddit})`.yellow);
          }
        }
      }); 
  }
};