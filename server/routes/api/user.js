const jiraUser = require('./jira/user')
const localUser = require('./local/user')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/me', function (req, res) {
    return settings.useJira().then(useJira => {
      if (useJira) {
        return jiraUser.me(req, res)
      } else {
        return localUser.me(req, res)
      }
    })
  })
}
