const jiraUser = require('./jira/user')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/me', function (req, res) {
    if (settings.useJira()) {
      return jiraUser.me(req, res)
    } else {
      return res.sendStatus(200)
    }
  })
}
