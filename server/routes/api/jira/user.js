const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  me: function (req, res) {
    return jiraRequestBuilder.jira('/myself', req).then(options => {
      return request(options).then((user) => {
        return res.send(user)
      }).catch(err => {
        console.log(err)
        return res.sendStatus(503)
      })
    })
  }
}
