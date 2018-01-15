export const onPingMessage = {
  meta: {
    command: 'ping (...and more)',
    description: `Responds with pong`
  },

  onEvent: ({ content, channel, author }) => {
    const answers = ['pong', 'pi- I mean pong', `I'm here!`, 'PONG']
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)]

    if (content === 'ping') {
      channel.send(randomAnswer)
    } else if (content === 'PING') {
      channel.send(randomAnswer.toUpperCase())
    } else if (content === 'pong') {
      channel.send('Hey, I was supposed to say that!')
    } else if (content.length === 0) {
      channel.send(`Yes, ${author.username}?`)
    }
  }
}
