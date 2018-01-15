import dotenv from 'dotenv'
import Snoowrap from 'snoowrap'

dotenv.config()

// console.log(process.env.R_CLIENT_ID)

export const r = new Snoowrap({
  userAgent: 'R6bot bot',
  clientId: process.env.R_CLIENT_ID,
  clientSecret: process.env.R_SECRET,
  username: process.env.R_USERNAME,
  password: process.env.R_PASSWORD
})
