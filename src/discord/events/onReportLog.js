import { discordEmbedBuilder } from '../utils/discordField'
import { getConfig } from '../../reddit/getConfig'
import { r } from '../../reddit/'

const truncString = (s, max) => {
  return s.toString().substring(0, max - 1) + (s.length > max ? '...' : '')
}

export const onReportLog = {
  meta: {
    command: 'report log',
    description: `Returns /about/reports from your target subreddit`
  },

  onEvent: async ({ content, channel }) => {
    const { targetSub } = await getConfig()
    const limit = 6
    const reportList = await r.getSubreddit(targetSub).getReports({ limit })
    const unmoderatedReports = reportList.filter(report => {
      return !report.approved && !report.ignore_reports
    })

    const genReportLog = list => {
      /** submission link prefix */
      const sPx = `https://reddit.com/comments/`

      return unmoderatedReports.map(report => {
        return {
          name: report.title
            ? `:small_blue_diamond:Post`
            : `:small_orange_diamond:Comment`,
          value:
            (report.title
              ? `"${report.title}"\n`
              : `"${truncString(report.body, 25)}"\n`) +
            `  **Reports:** ${report.num_reports}\n` +
            `  **Reasons:** \n${[...report.user_reports, ...report.mod_reports]
              .map(arr => `  • "${arr[0]}" (${arr[1]})`)
              .join('\n')}\n` +
            `  **Permalink:** ${
              report.title
                ? sPx + report.id
                : sPx + `${report.link_id.substring(3)}//${report.id}`
            }\n`
        }
      })
    }

    if (content === 'report log' && unmoderatedReports.length > 0) {
      channel.send(
        discordEmbedBuilder(
          {
            title: `r/${targetSub}/about/reports`,
            description: `Here's the last ${limit} submissions with recent reports`,
            fields: [
              ...genReportLog(unmoderatedReports),
              {
                name: 'Link to Reports',
                value: `https://reddit.com/r/${targetSub}/about/reports`
              }
            ]
          },
          false
        )
      )
    } else if (content === 'report log' && unmoderatedReports.length === 0) {
      channel.send('report log is empty my dudes! :tada:')
    }
  }
}
