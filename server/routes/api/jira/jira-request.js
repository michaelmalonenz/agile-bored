const urlJoin = require('url-join')
const settings = require('../../../settings')

module.exports = {
  jira: function (apiSuffix, req, method = 'GET') {
    return _buildRequestOptions('/rest/api/2', apiSuffix, req, method)
  },
  agile: function (apiSuffix, req) {
    return _buildRequestOptions('/rest/agile/1.0', apiSuffix, req)
  },
  greenhopper: function (apiSuffix, req) {
    return _buildRequestOptions('/rest/greenhopper/1.0', apiSuffix, req)
  }
}

function _buildRequestOptions (apiPrefix, apiSuffix, req, method = 'GET') {
  return settings.jiraUrl().then(jiraUrl => {
    return {
      uri: urlJoin(jiraUrl, apiPrefix, apiSuffix),
      method: method,
      headers: {
        'Authorization': req.get('Authorization')
      },
      json: true // Automatically parses the JSON string in the response
    }
  })
}
