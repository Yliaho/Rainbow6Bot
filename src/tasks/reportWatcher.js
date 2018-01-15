import { createTask } from './'
import { r } from '../reddit/'
import { findReportbyId, writeReport } from '../database/index'
import { discord } from '../index'
import { discordEmbedBuilder } from '../discord/utils/discordField'
import { createReactionListener } from '../discord/utils/reactions'

export const reportWatcher = createTask({
  name: 'reportWatcher',

  routine: {
    created() {},

    async routine({ routineConfig, targetSub }) {
      const { reportTreshold } = routineConfig

      const reports = await r.getSubreddit(targetSub).getReports()
      const positives = reports.filter(submission => {
        return (
          submission.user_reports.length + submission.mod_reports.length >=
            reportTreshold &&
          !submission.ignore_reports &&
          !submission.approved &&
          !findReportbyId(submission.id)
        )
      })

      if (positives.length > 0) {
        for (let submission of positives) {
          const submissionUrl = `https://reddit.com${submission.permalink}`
          const submissionThumbnail = submission.hasOwnProperty('thumbnail')
            ? submission.thumbnail
            : ''

          writeReport({
            title: submission.title,
            id: submission.id,
            url: submissionUrl,
            thumbnail: submissionThumbnail,
            viewCount: submission.view_count
          })

          const iterateUserReports = userReports => {
            return userReports
              .map(arr => {
                return `**(${arr[1]})** ${arr[0]}`
              })
              .join('\n')
          }
          const embed = {
            title: `r/${targetSub} has unmoderated reports`,
            description: `Found ${
              positives.length
            } report(s) that exceed the report treshold`,
            thumbnail: submission.thumbnail || null,
            color: '#F77737',
            fields: [
              {
                name: 'Submission Title',
                value: `${submission.title}`
              },
              {
                name: 'Submission Body',
                value: `${submission.body}`
              },
              {
                name: 'Number of Reports',
                value: `${submission.num_reports}`,
                inline: true
              },
              {
                name: 'View Count',
                value: `${submission.view_count}`,
                inline: true
              },
              {
                name: 'Score',
                value: submission.score,
                inline: true
              },
              {
                name: 'User Reports',
                value: iterateUserReports(submission.user_reports)
              },
              {
                name: 'Permalink',
                value: submissionUrl
              }
            ]
          }
          discord.sendMessage(
            {
              message: discordEmbedBuilder(embed, true)
            },
            message =>
              createReactionListener(message, 'checkmark', (user, reaction) => {
                message.edit(`\nchecked by: ${user.username} ${reaction}`)
              })
          )
        }
      }
    }
  },

  verbose: true
})
