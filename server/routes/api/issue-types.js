const localIssueTypes = require('./local/issue-types')
const jiraIssueTypes = require('./jira/issue-types')

module.exports = function (router) {
  router.get('/issuetypes', function (req, res) {
    if (req.settings && req.settings.useJira) {
      return jiraIssueTypes.getIssueTypes(req, res)
    }
    return localIssueTypes.getIssueTypes(req, res)
  })
}
