import { r } from '../reddit/'
import { createTask } from './index'
import { discord } from '../index'
import { discordEmbedBuilder } from '../discord/utils/discordField'
import { findReportbyId, writeReport } from '../database/'

export const risingReports = createTask({
  name: 'risingReports',

  routine: {
    created() {},

    async routine({ routineConfig, targetSub }) {
      const risingListing = await r.getSubreddit(targetSub).getRising()
      const positives = risingListing.filter(post => {
        return (
          post.num_reports > routineConfig.reportTreshold &&
          !post.ignore_reports &&
          !findReportbyId(post.id)
        )
      })

      if (positives.length > 0) {
        for (let post of positives) {
          const postUrl = `https://reddit.com${post.permalink}`
          const postThumbnail = post.hasOwnProperty('thumbnail')
            ? post.thumbnail
            : ''

          writeReport({
            title: post.title,
            id: post.id,
            url: postUrl,
            thumbnail: postThumbnail,
            viewCount: post.view_count
          })

          discord.sendMessage({
            message: discordEmbedBuilder(
              {
                title: `r/${targetSub}/rising has reports`,
                description: `Found ${positives.length} report(s)`,
                thumbnail: postThumbnail,
                fields: [
                  {
                    name: 'Post Title',
                    value: `${post.title}`
                  },
                  {
                    name: 'Number of Reports',
                    value: `${post.num_reports}`,
                    inline: true
                  },
                  {
                    name: 'View Count',
                    value: `${post.view_count}`,
                    inline: true
                  },
                  {
                    name: 'Score',
                    value: post.score,
                    inline: true
                  },
                  {
                    name: 'Permalink',
                    value: postUrl
                  }
                ]
              },
              false
            )
          })
        }
      }
    },

    verbose: true
  },

  verbose: true
})
