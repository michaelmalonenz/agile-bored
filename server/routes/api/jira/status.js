const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  getStatuses: function (req, res) {
    var options = jiraRequestBuilder('project/PS/statuses', req)
    request(options).then((statuses) => {
      return res.send(statuses)
    })
  }
}
