const config = {
  targetSubreddit: 'rainbow6',
  messageText: fs.readFileSync('./plaintext/message.txt').toString(),
  flair: {
    class: 'redditall',
    text: 'r/all'
  }
};

const r = new snoowrap({
  userAgent:    process.env.SW_USER_AGENT,
  clientId:     process.env.SW_CLIENT_ID,
  clientSecret: process.env.SW_SECRET,
  username:     process.env.SW_USER,
  password:     process.env.SW_PASSWORD
});

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

console.log(`--- target subreddit: r/${config.targetSubreddit} ---`);


module.exports = {
  loopAll: () => {
      r.getHot('all').map(post => post).then(post => {
          let count = 0;
          for (let i in post) {
            count++;
            if (post[i].subreddit.display_name == config.targetSubreddit) {
              console.log(`found post (${post[i].id}) matching target subreddit (r/${config.targetSubreddit})`);
              if (post[i].link_flair_css_class != config.flair.class) {
                console.log(`...we haven't seen this before!`);
                processPost(post[i].id);
              } else {
                console.log(`...it's old`);
              }
            } else if (count >= post.length && post[i].subreddit.display_name != config.targetSubreddit) {
              console.log(`no posts found matching target subreddit (r/${config.targetSubreddit})`);
            }
          }
      }); 
  }
};
