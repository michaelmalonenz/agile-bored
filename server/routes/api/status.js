const db = require('../../models')
const jiraStatuses = require('./jira/status')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/statuses', function (req, res) {
    if (settings.useJira()) {
      return jiraStatuses.getStatuses(req, res)
    } else {
      return db.IssueStatus.findAll().then(statuses => {
        res.send(statuses)
      })
    }
  })
}
