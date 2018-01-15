import { discordEmbedBuilder } from '../utils/discordField'
import { getBulkReports } from '../../database/'

export const onReportBulkHistory = {
  meta: {
    command: 'report history',
    description: `Returns a list of logged submissions that exceeded the report treshold`
  },

  onEvent: ({ content, channel }) => {
    const reportAmount = 5

    const iterateReports = getBulkReports(reportAmount).map(obj => {
      return {
        name: `${obj.title}`,
        value: `${obj.url}`
      }
    })

    if (content === 'report history') {
      channel.send(
        discordEmbedBuilder(
          {
            title: `/rising report history ${reportAmount}`,
            description: '------------',
            fields: iterateReports
          },
          false
        )
      )
    }
  }
}
