import { discord } from '../../'
import { createReaction } from '../utils/reactions'

export const onAddReaction = {
  meta: {
    command: 'reaction',
    description: `Simple test message by the bot that adds a reaction to itself`
  },

  onEvent: ({ content, channel }) => {
    if (content === 'reaction') {
      discord.sendMessage(
        {
          message:
            'I should be adding a reaction to my own message... Did it work?'
        },
        message => createReaction(message, 'checkmark')
      )
    }
  }
}
