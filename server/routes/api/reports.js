const localReports = require('./local/reports')
const jiraReports = require('./jira/reports')

module.exports = function (router) {
  router.get('/reports/org-stats', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraReports.orgStats(req, res)
    }
    return localReports.orgStats(req, res)
  })

  router.get('/reports/epicremaining', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraReports.epicRemaining(req, res)
    }
    res.send('Nothing to see here')
  })
}
