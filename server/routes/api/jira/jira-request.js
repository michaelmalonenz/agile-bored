const urlJoin = require('url-join')
const settings = require('../../../settings')

module.exports = function (apiSuffix, req) {
  return {
    uri: urlJoin(settings.jiraUrl, '/rest/api/2', apiSuffix),
    headers: {
      'Authorization': req.get('Authorization')
    },
    json: true // Automatically parses the JSON string in the response
  }
}
