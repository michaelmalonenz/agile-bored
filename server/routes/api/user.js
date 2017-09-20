const request = require('request-promise-native')
const jiraRequestBuilder = require('../../utils/jira-request')

module.exports = function (router) {
  router.get('/me', function (req, res) {
    var options = jiraRequestBuilder('/myself', req)
    request(options).then((user) => {
      return res.send(user)
    })
  })
}
