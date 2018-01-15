import chalk from 'chalk'

const CREATE_ID = () =>
  Math.random()
    .toString(36)
    .substr(2, 24)

const LOG_TASK_METADATA = (name, id, hookName) => {
  console.log(chalk.white.bgHex('#2364AA').bold(` TASK EXECUTED ↓ `))
  console.log(chalk`  |
  | Task Name: {green ${name}}
  |        ID: {green ${id}}
  |      Hook: {green ${hookName}}
  |      Time: {green ${new Date().toISOString()}}
  |`)
}

const isIdentifiable = state => ({
  initTask: name => {
    state.name = name || 'untitledTask'
    state.id = CREATE_ID()
  }
})

const hasLifecycle = state => ({
  executeRoutine: config => {
    return new Promise((resolve, reject) => {
      const { created, ...afterCreated } = state.routine

      if (!state.didExecuteOnce) {
        created()
        state.didExecuteOnce = !state.didExecuteOnce
      }

      if (config.hasOwnProperty(state.name)) {
        Object.entries(afterCreated).forEach(([key, value]) => {
          if (state.verbose) LOG_TASK_METADATA(state.name, state.id, key)

          Promise.resolve(
            value({
              targetSub: !config.devMode ? config.targetSub : config.devSub,
              state,
              routineConfig: {
                discordNotifications: config.discordNotifications,
                ...config[state.name]
              }
            })
          ).then(() => {
            console.log('Task finished\n')
            resolve()
          })
        })
      } else {
        throw new Error(
          `Couldn't resolve configuration for task ${state.name} (${state.id})`
        )
      }
    })
  }
})

export const createTask = ({
  name = '',
  config = {},
  routine = {},
  verbose = false
} = {}) => {
  const state = {
    config,
    routine,
    verbose,
    didExecuteOnce: false
  }

  Object.assign(state, isIdentifiable(state), hasLifecycle(state))

  state.initTask(name)

  return state
}
