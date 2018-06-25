const request = require('request-promise-native')

const ONE_DAY = 1000 * 60 * 60 * 24
const cache = {}

class CachedResponse {
  constructor (content) {
    this.content = content
    this.cachedAt = Date.now()
  }

  get cacheTimeValid () {
    return (Date.now() - this.cachedAt) < ONE_DAY
  }
}

module.exports = function (options) {
  if (cache[options.uri] && cache[options.uri].cacheTimeValid) {
    return Promise.resolve(cache[options.uri].content)
  } else {
    return request(options).then(result => {
      cache[options.uri] = new CachedResponse(result)
      return result
    })
  }
}
