const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  me: function (req, res) {
    var options = jiraRequestBuilder('/myself', req)
    request(options).then((user) => {
      return res.send(user)
    }).catch(err => {
      return res.sendStatus(err.statusCode)
    })
  }
}
