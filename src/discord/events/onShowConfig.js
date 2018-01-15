import { targetSub, getConfig } from '../../reddit/getConfig'
import { discordEmbedBuilder } from '../utils/discordField'

export const onShowConfig = {
  meta: {
    command: 'show config',
    description: `Returns the bot config specified in your target sub's wiki/r6bot/config`
  },

  onEvent: async ({ content, channel }) => {
    const config = await getConfig()

    if (content === 'show config') {
      channel.send(
        discordEmbedBuilder(
          {
            title: 'Config for r6bot',
            description: `This config is fetched from ${targetSub}. Change the target/dev sub from the bot's enviroment variable (where you host the bot)`,
            fields: [
              {
                name: `r/${targetSub}/wiki/r6bot/config`,
                value: `\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``
              },
              {
                name: 'Want to change something? Edit it here...',
                value: `https://reddit.com/r/${targetSub}/wiki/edit/r6bot/config`
              }
            ]
          },
          false
        )
      )
    }
  }
}
