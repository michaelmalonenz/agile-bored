const localStatuses = require('./local/status')
const jiraStatuses = require('./jira/status')

module.exports = function (router) {
  router.get('/statuses', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraStatuses.getStatuses(req, res)
    }
    return localStatuses.getStatuses(req, res)
  })
}
