import { r } from '../reddit/'
import { createTask } from './index'
import { writePost, findPostbyId } from '../database/'
import { discord } from '../index'
import { discordEmbedBuilder } from '../discord/utils/discordField'
// import { errorHandler } from '../errorHandler'

const processResults = (
  { flair, messageText, discordNotifications },
  posts
) => {
  posts.forEach(post => {
    if (!findPostbyId(post.id)) {
      r
        .getSubmission('6z2olf')
        .assignFlair({ text: flair.text, cssClass: flair.class })
        .reply(messageText)
        .then(comment => {
          r
            .getComment(comment)
            .distinguish({ status: true, sticky: true })
            .then(() => {
              writePost(
                post.title,
                post.id,
                `https://reddit.com${post.permalink}`,
                post.thumbnail
              )
              if (discordNotifications) {
                discord.sendMessage({
                  message: discordEmbedBuilder(
                    {
                      title: `Found ${
                        process.env.BOT_TARGETSUB
                      } post from r/all`,
                      description: `Stickied a notification comment and tagged the submission`,
                      thumbnail: post.thumbnail,
                      fields: [
                        {
                          name: 'Title',
                          value: post.title
                        },
                        {
                          name: 'Score',
                          value: post.score,
                          inline: true
                        },
                        {
                          name: 'Post Type',
                          value: post.post_hint
                        },
                        {
                          name: 'URL',
                          value: post.url,
                          inline: true
                        },
                        {
                          name: 'Permalink',
                          value: `https://reddit.com${post.permalink}`,
                          inline: true
                        }
                      ]
                    },
                    false
                  )
                })
              }
            })
        })
    } else {
      console.log(`post with id ${post.id} is already processed and registered`)
    }
  })
}

export const rAll = createTask({
  name: 'rAllWatcher',

  routine: {
    created() {
      //
    },

    async routine({ routineConfig, targetSub }) {
      const rAll = await r.getHot('all', { limit: routineConfig.treshold })
      const positiveResults = rAll.filter(post => {
        return post.subreddit.display_name === targetSub
      })

      if (positiveResults.length >= 1) {
        processResults(routineConfig, positiveResults)
      } else {
        console.log('no posts found')
      }
    }
  },

  verbose: true
})
