import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

export default axios.create({
  baseURL: 'https://api.giphy.com/v1/',

  params: {
    api_key: process.env.GIF_API_KEY
  }
})
