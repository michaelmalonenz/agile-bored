const jiraRequestBuilder = require('./jira-request')
const IssueTypeViewModel = require('../../../viewmodels/issue-type')
const settings = require('../../../settings')
const cachedRequest = require('./cached-request')

module.exports = {
  getIssueTypes: function (req, res) {
    return settings.jiraProjectName()
      .then(url => jiraRequestBuilder.jira('issuetype', req))
      .then(options => cachedRequest(options))
      .then(issueTypes => {
        const result = []
        for (let issueType of issueTypes) {
          result.push(IssueTypeViewModel.createFromJira(issueType))
        }
        res.send(result)
      })
      .catch(err => res.status(502).send(err))
  }
}
