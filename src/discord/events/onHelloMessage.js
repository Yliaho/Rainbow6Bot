export const onHelloMessage = {
  meta: {
    command: 'hello',
    description: `It'll make the bot say hello back!`
  },

  onEvent: ({ content, channel }) => {
    if (content === 'hello') {
      channel.send('hello!')
    }
  }
}
