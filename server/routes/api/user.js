const jiraUser = require('./jira/user')

module.exports = function (router) {
  router.get('/me', function (req, res) {
    return jiraUser.me(req, res)
  })
}
