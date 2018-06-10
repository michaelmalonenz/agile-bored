const jiraRequestBuilder = require('./jira-request')
const IssueTypeViewModel = require('../../../viewmodels/issue-type')
const settings = require('../../../settings')
const cachedRequest = require('./cached-request')

module.exports = {
  getIssueTypes: function (req, res) {
    return settings.jiraProjectName()
      .then(projectName => jiraRequestBuilder.jira(`project/${projectName}`, req))
      .then(options => cachedRequest(options))
      .then(project => {
        const result = []
        for (let issueType of project.issueTypes) {
          result.push(IssueTypeViewModel.createFromJira(issueType))
        }
        res.send(result)
      })
      .catch(err => res.status(502).send(err))
  }
}
