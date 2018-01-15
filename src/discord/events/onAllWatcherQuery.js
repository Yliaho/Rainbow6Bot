import { getBulkPosts } from '../../database/'
import { discordEmbedBuilder } from '../utils/discordField'

export const onAllWatcherQuery = {
  meta: {
    command: 'r/all history',
    description: `Returns the history log of the submissions, that appeared in r/all`
  },

  onEvent: ({ content, channel }) => {
    const postsAmount = 5

    const iteratePosts = getBulkPosts(postsAmount).map(obj => {
      return {
        name: `\`\`\`\n${obj.title}\n\`\`\``,
        value: `${obj.url}`
      }
    })

    if (content === 'r/all history') {
      channel.send(
        discordEmbedBuilder(
          {
            title: `Here is the last ${postsAmount} submissions found from r/all`,
            description: '------------',
            fields: iteratePosts
          },
          false
        )
      )
    }
  }
}
