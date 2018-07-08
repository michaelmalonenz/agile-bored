const jiraUser = require('./jira/user')
const localUser = require('./local/user')

module.exports = function (router) {
  router.get('/me', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraUser.me(req, res)
    } else {
      return localUser.me(req, res)
    }
  })
}
