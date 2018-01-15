import co from 'co'
import { setInterval } from 'timers'
import { getConfig as getSubConfig } from '../reddit/getConfig'

const receivesConfig = state => ({
  getConfig: () => {
    return getSubConfig()
    // return new Promise((resolve, reject) => {
    //   if (state.config instanceof Object) {
    //     resolve(state.config)
    //   } else {
    //     reject(new Error('Config is not an object or is not defined'))
    //   }
    // })
  }
})

const hasRunner = state => ({
  runTasks: tasks => {
    setInterval(async () => {
      try {
        const config = await state.getConfig()

        state.iterateTasks(config)
      } catch (error) {
        console.error('ERROR---------------')
        console.error(error)
      }
    }, state.interval)
  },
  /* eslint-disable */
  // TODO: prettier makes generator asterisk like this for some reason
  iterateTasks: co.wrap(function*(config) {
    for (const task of state.tasks) {
      yield task.executeRoutine(config)
    }
  })
  /* eslint-disable enable */
})

export const createTaskRunner = ({
  tasks = [],
  config = {},
  runsPerHour = 500
} = {}) => {
  const INTERVAL = 1000 * 60 * 60 / runsPerHour
  const state = {
    tasks,
    config,
    interval: INTERVAL
  }

  Object.assign(state, receivesConfig(state), hasRunner(state))

  return state
}
