const REACTIONS = {
  checkmark: '✅',
  nuke: '☢️'
}

const ONE_HOUR = 1000 * 60 * 60 * 24

/**
 * @param {*} contextMessage the message, in which add we add the reaction
 * @param {*} reaction the reaction emoji
 */
export const createReaction = (contextMessage, reaction) => {
  const addReaction = REACTIONS[reaction]
    ? REACTIONS[reaction]
    : REACTIONS.checkmark

  contextMessage.react(addReaction)
}

/**
 * @param {*} contextMessage the message, in which add we add the reaction
 * @param {*} reaction the reaction emoji
 */
export const createReactionListener = (contextMessage, reaction, callback) => {
  createReaction(contextMessage, reaction)

  function reactionListener({ count, emoji, message }, user) {
    if (
      message.id === contextMessage.id &&
      !user.bot &&
      emoji.name === REACTIONS[reaction]
    ) {
      callback(user, REACTIONS[reaction])
      contextMessage.client.removeListener(
        'messageReactionAdd',
        reactionListener
      )
      contextMessage.clearReactions()
    }

    setTimeout(() => {
      contextMessage.client.removeListener(
        'messageReactionAdd',
        reactionListener
      )
      contextMessage.edit('**Expired:** no reactions after 12 hours')
      contextMessage.clearReactions()
    }, ONE_HOUR / 2)
  }

  contextMessage.edit(
    contextMessage.content + '\n:hourglass: waiting for reaction...'
  )
  contextMessage.client.on('messageReactionAdd', reactionListener)
}
