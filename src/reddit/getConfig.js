import { r } from './'

export const targetSub = process.env.BOT_DEVSUB.length
  ? process.env.BOT_DEVSUB
  : process.env.BOT_TARGETSUB

export const getConfig = async () => {
  try {
    const config = await r
      .getSubreddit(targetSub)
      .getWikiPage('/r6bot/config')
      .refresh()
    const configObj = JSON.parse(config.content_md)

    return configObj
  } catch (error) {
    console.error('ERROR', error)
  }
}
