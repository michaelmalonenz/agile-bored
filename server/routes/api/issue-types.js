const localIssueTypes = require('./local/issue-types')
const jiraIssueTypes = require('./jira/issue-types')
const settings = require('../../settings')

module.exports = function (router) {
  router.get('/issuetypes', function (req, res) {
    return settings.useJira().then(useJira => {
      if (useJira) {
        return jiraIssueTypes.getIssueTypes(req, res)
      } else {
        return localIssueTypes.getIssueTypes(req, res)
      }
    })
  })
}
