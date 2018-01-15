import axios from '../../axios'

export const onGifRequest = {
  meta: {
    command: 'gif <SEARCH PARAMETER>',
    description: `Returns a random gif based on the search parameter`
  },

  onEvent: ({ content, channel }) => {
    const gifPrefix = 'gif '
    const limit = 5

    if (content.startsWith(gifPrefix)) {
      axios
        .get(`gifs/search?q=${content.slice(gifPrefix.length)}&limit=${limit}`)
        .then(({ data }) => {
          channel.send(
            data.data[Math.floor(Math.random() * data.data.length)].embed_url
          )
        })
    }
  }
}
