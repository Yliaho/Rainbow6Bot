import { statSync } from 'fs'
import { join } from 'path'

// thank you to Aliceljm on StackOverflow for this
// /questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function bytesToSize(bytes) {
  if (bytes === 0) return '0 Byte'

  const sizes = ['Bytes', 'kb', 'Mb', 'Gb', 'Tb']

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export const onStoreSize = {
  meta: {
    command: 'store',
    description: `It returns the current capacity of the bot's database`
  },

  onEvent: ({ content, channel }) => {
    if (content === 'store') {
      const stats = statSync(join(__dirname, '../../../store.json'))

      channel.send(`The database is currently using ${bytesToSize(stats.size)}`)
    }
  }
}
