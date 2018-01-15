import { discordEmbedBuilder } from '../utils/discordField'

export const onHelp = {
  meta: {
    command: 'help',
    description: `help command (this)`
  },

  onEvent: ({ content, channel }, events) => {
    if (content === 'help') {
      const metaFields = Object.values(events).map(({ meta }) => {
        return {
          name: `\`!r6 ${meta.command}\``,
          value: `\`\`\`yaml\n` + `"${meta.description}"\n` + `\`\`\`` + `\n---`
        }
      })

      channel.send(
        discordEmbedBuilder({
          title: 'Commands',
          description: `Here's the list of all available bot commands`,
          fields: [...metaFields]
        })
      )
    }
  }
}
