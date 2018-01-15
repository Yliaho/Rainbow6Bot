import { discord } from '../../'
import { createReactionListener } from '../utils/reactions'
import { discordEmbedBuilder } from '../utils/discordField'

export const onAddReactionListener = {
  meta: {
    command: 'reaction listener',
    description: `Something, don't worry about it`
  },

  onEvent: ({ content, channel }) => {
    if (content === 'reaction listener') {
      const embed = {
        title: 'hello',
        description: 'testing',
        thumbnail:
          'https://b.thumbs.redditmedia.com/htv-cLwkXTyZrlDzbbDnydRMxbTUBuWQvwLVlNcPscI.jpg',
        fields: [
          {
            name: 'jeee',
            value: 'joo'
          },
          {
            name: 'jeee',
            value: 'joo'
          }
        ]
      }

      discord.sendMessage(
        {
          message: discordEmbedBuilder(embed),
          channelId: '288867111546388481'
        },
        message =>
          createReactionListener(message, 'checkmark', (user, reaction) => {
            message.edit(`\n**checked by:** ${user.username} ${reaction}`)
          })
      )
    }
  }
}
