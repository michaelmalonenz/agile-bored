const jiraEstimation = require('./jira/estimation')

module.exports = function (router) {
  router.get('/estimate/:epicId', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraEstimation.getEstimateForEpic(req, res)
    }
    res.send('100d')
  })
}
