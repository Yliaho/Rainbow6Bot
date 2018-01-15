import dotenv from 'dotenv'
import { spawnDiscord } from './discord/'
import { createTaskRunner } from './taskRunner/index'
// import { rAll } from './tasks/rAllWatcher'
import { reportWatcher } from './tasks/reportWatcher'
import { r } from './reddit/index'

dotenv.config()

console.log('dir', __dirname)
const runner = createTaskRunner({
  tasks: [reportWatcher],
  config: {
    devMode: false,
    targetSub: 'politics',
    devSub: 'Rainbow6css',
    discordNotifications: true,
    rAllWatcher: {
      treshold: 33,
      messageText: 'Testing',
      flair: {
        class: 'rAll',
        text: 'r/all'
      }
    },
    streamCatcher: {
      watchUser: 'rainbow6'
    },
    reportWatcher: {
      reportTreshold: 2
    }
  },
  runsPerHour: 30
})

runner.runTasks()

export const discord = spawnDiscord()

discord.createClient(process.env.DC_TOKEN).then(() => {})

discord.listenMessages()
