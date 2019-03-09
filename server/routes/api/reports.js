const localReports = require('./local/reports')
const jiraReports = require('./jira/reports')

module.exports = function (router) {
  router.get('/reports/cumulativeflow', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraReports.cumulativeFlow(req, res)
    }
    return localReports.cumulativeFlow(req, res)
  })
}
