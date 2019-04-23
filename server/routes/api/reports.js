const localReports = require('./local/reports')
const jiraReports = require('./jira/reports')

module.exports = function (router) {
  router.get('/reports/perf-stats', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraReports.perfStats(req, res)
    }
    return localReports.perfStats(req, res)
  })

  router.get('/reports/epicremaining', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraReports.epicRemaining(req, res)
    }
    res.send('Nothing to see here')
  })
}
