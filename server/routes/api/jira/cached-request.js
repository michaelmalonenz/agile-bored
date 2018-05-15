const request = require('request-promise-native')

const cache = {}

class CachedResponse {
  constructor (content) {
    this.content = content
    this.cachedAt = Date.now()
  }
}

module.exports = function (options) {
  if (cache[options.uri]) {
    return Promise.resolve(cache[options.uri].content)
  } else {
    return request(options).then(result => {
      cache[options.uri] = new CachedResponse(result)
      return result
    })
  }
}
