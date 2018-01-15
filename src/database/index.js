import low from 'lowdb/lib/fp'
import FileSync from 'lowdb/adapters/FileSync'
import { find, concat, sortBy, take } from 'lodash/fp'

const adapter = new FileSync('store.json')
const db = low(adapter)

const defaultPostsValue = []
const posts = db('posts', defaultPostsValue)
const reports = db('reports', defaultPostsValue)

export const writePost = (title, id, url, thumbnail) => {
  posts.write(
    concat({ title, id, thumbnail, url, added: new Date().getTime() })
  )
}

export const writeReport = ({
  title,
  id,
  url,
  numReports,
  thumbnail,
  viewCount
}) => {
  reports.write(
    concat({
      title,
      id,
      thumbnail,
      url,
      viewCount,
      numReports,
      added: new Date().getTime()
    })
  )
}

export const findReportbyId = id => {
  const report = reports(find({ id }))

  return report
}

export const findPostbyId = id => {
  const post = posts(find({ id }))

  return post
}

export const getBulkPosts = amount => {
  return posts([sortBy('added'), take(amount)].reverse())
}

export const getBulkReports = amount => {
  return reports([sortBy('added'), take(amount)].reverse())
}
