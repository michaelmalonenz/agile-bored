const urlJoin = require('url-join')
const settings = require('../../../settings')

module.exports = function (apiSuffix, req) {
  return settings.jiraUrl().then(jiraUrl => {
    return {
      uri: urlJoin(jiraUrl, '/rest/api/2', apiSuffix),
      headers: {
        'Authorization': req.get('Authorization')
      },
      json: true // Automatically parses the JSON string in the response
    }
  })
}
