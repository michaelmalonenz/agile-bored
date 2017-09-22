const urlJoin = require('url-join')

module.exports = function (apiSuffix, req) {
  return {
    uri: urlJoin('https://aranzgeo.atlassian.net/rest/api/2', apiSuffix),
    headers: {
      'Authorization': req.get('Authorization')
    },
    json: true // Automatically parses the JSON string in the response
  }
}
