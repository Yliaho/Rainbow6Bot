import Discord from 'discord.js'
import {
  onPingMessage,
  onHelloMessage,
  onAllWatcherQuery,
  onReportBulkHistory,
  onShowConfig,
  onReportLog,
  onAddReaction,
  onGifRequest,
  onStoreSize,
  onHelp,
  onAddReactionListener
} from './events/index'

const discordClient = new Discord.Client()

const discordConnection = state => ({
  createClient: token => {
    state.client.login(token)

    return new Promise((resolve, reject) => {
      state.client.on('ready', () => {
        console.log('discord client ready')
        resolve(true)
      })
    })
  }
})

const discordBotCommand = state => ({
  addMessageEvents: payload => {
    for (let [name, eventObject] of Object.entries(payload)) {
      state.events[name] = eventObject
    }
  },

  listenMessages: () => {
    state.client.on('message', message => {
      const BOT_COMMAND = '!r6 '

      if (message.content.startsWith(BOT_COMMAND)) {
        for (let [name, event] of Object.entries(state.events)) {
          if (message.content === `${BOT_COMMAND}help`) {
            return state.events.onHelp.onEvent(
              {
                ...message,
                content: message.content.slice(BOT_COMMAND.length)
              },
              state.events
            )
          }

          console.log(name)
          event.onEvent({
            ...message,
            content: message.content.slice(BOT_COMMAND.length)
          })
        }
      }
    })
  }
})
const discordMessages = state => ({
  sendMessage: (
    { channelId = process.env.DC_DEFAULT_CHANNEL, message },
    callback = null
  ) => {
    state.client.channels
      .get(channelId)
      .send(message)
      .then(message => callback(message))
  }
})

export const spawnDiscord = ({ config = {} } = {}) => {
  const state = {
    client: discordClient,
    events: {}
  }
  Object.assign(
    state,
    discordConnection(state),
    discordBotCommand(state),
    discordMessages(state)
  )

  state.addMessageEvents({
    onPingMessage,
    onHelloMessage,
    onAllWatcherQuery,
    onReportBulkHistory,
    onShowConfig,
    onReportLog,
    onAddReaction,
    onGifRequest,
    onStoreSize,
    onHelp,
    onAddReactionListener
  })

  return state
}
