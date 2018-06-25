const fs = require('fs')
const path = require('path')
const url = require('url')
const request = require('request-promise-native')

const CACHE_PATH = '/tmp/cache'
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7

if (!fs.existsSync(CACHE_PATH)) {
  fs.mkdirSync(CACHE_PATH)
}

module.exports = function (options) {
  return getCachedFile(options.uri)
    .then((cachedFile) => {
      if (cachedFile) {
        return cachedFile
      } else {
        return request(options)
          .then(result => {
            return cacheFile(options.uri, result)
              .then(() => result)
          })
      }
    })
}

function getCachedFile (uri) {
  return new Promise((resolve, reject) => {
    const cachedFilePath = cachedFileName(uri)
    if (fs.existsSync(cachedFilePath)) {
      fs.readFile(cachedFilePath, (err, data) => {
        if (err) resolve(null)
        const stats = fs.statSync(cachedFilePath)
        if ((Date.now() - stats.mtimeMs) > ONE_WEEK) {
          resolve(null)
        } else {
          resolve(data)
        }
      })
    } else {
      resolve(null)
    }
  })
}

function cacheFile (uri, result) {
  return writeFile(cachedFileName(uri), result)
}

function cachedFileName (uri) {
  const q = url.parse(uri, true).query
  return path.join(CACHE_PATH, `${q.ownerId}_${q.size}_${q.avatarId}`)
}

function writeFile (name, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, contents, { flag: 'w+' }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
