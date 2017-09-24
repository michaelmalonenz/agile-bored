const jiraUser = require('./jira/user')

const useJira = true

module.exports = function (router) {
  router.get('/me', function (req, res) {
    if (useJira) {
      return jiraUser.me(req, res)
    } else {
      return res.sendStatus(200)
    }
  })
}
