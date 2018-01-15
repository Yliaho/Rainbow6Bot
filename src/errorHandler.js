import { discord } from './index'
import { discordEmbedBuilder } from './discord/utils/discordField'

function callerName() {
  try {
    throw new Error()
  } catch (e) {
    try {
      return e.stack.split('at ')[3].split(' ')[0]
    } catch (e) {
      return 'function'
    }
  }
}

/**
 * @param {boolean} sendToDiscord send error message to discord
 * @param {*} error the error
 */
export const errorHandler = (sendToDiscord = false, error) => {
  const stackTrace = callerName()
  console.error(error)

  if (sendToDiscord) {
    discord.sendMessage({
      message: discordEmbedBuilder(
        {
          title: `Beep Boop! An error occured.`,
          description: `${stackTrace.replace(/.*\//).slice(9)}`,
          fields: [
            {
              name: 'Error output',
              value: `\`\`\`\n${error}\n\`\`\``
            }
          ],
          color: '#FC507A'
        },
        false
      )
    })
  }
}
