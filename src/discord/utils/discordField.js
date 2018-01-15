import { RichEmbed } from 'discord.js'
import { BOT_VERSION } from '../../globals'

const truncString = (s, max) => {
  return s.toString().substring(0, max - 1) + (s.length > max ? '...' : '')
}

/**
 *
 * @param {String} title - The title of the embed post
 * @param {String} description - The description
 * @param {array} fields - The fields array. Requires name and value
 * @param {String} image - Image url
 * @param {String} thumbnail - Thumbnail url
 * @param {String} footer - Footer text
 * @param {String} color Hex value. Adds a little colored stripe to the embed object
 */
export const discordEmbedBuilder = (
  {
    title = '',
    description = '',
    fields = [],
    image = '',
    thumbnail = '',
    footer = `${new Date().toUTCString()} – r6bot version ${BOT_VERSION}`,
    color = '#2B81C6'
  } = {},
  truncFields
) => {
  const embed = new RichEmbed()
    .setTitle(`R6Bot – ${title}`)
    .setDescription(description)
    .setImage(image)
    .setColor(color)
    .setFooter(footer)

  embed.setThumbnail(thumbnail)

  if (fields) {
    fields.map(field => {
      if (field.value && field.value !== 'undefined') {
        embed.addField(
          field.name,
          truncFields ? truncString(field.value, 140) : field.value,
          field.inline
        )
      }
    })
  }
  return embed
}
