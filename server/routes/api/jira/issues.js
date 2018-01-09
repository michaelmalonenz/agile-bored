const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')
const settings = require('../../../settings')

module.exports = {
  findAllIssues: function (req, res) {
    return settings.jiraProjectName()
      .then(jiraProjectName => {
        const issueJQL = `project = ${jiraProjectName} AND status not in (Done, "To Do") order by priority ASC`
        const encodedJQL = encodeURIComponent(issueJQL)
        return jiraRequestBuilder(`search?jql=${encodedJQL}`, req)
      })
      .then(options => {
        return request(options).then((result) => {
          let issues = []
          for (let issue of result.issues) {
            issues.push(IssueViewModel.createFromJira(issue))
          }
          return res.send(issues)
        })
      })
  },
  search: function (req, res) {
    return settings.jiraProjectName()
      .then(jiraProjectName => {
        const issueJQL = `project = ${jiraProjectName} AND status != Done AND (description ~ "${req.query.search}" OR summary ~ "${req.query.search}") order by priority ASC`
        const encodedJQL = encodeURIComponent(issueJQL)
        return jiraRequestBuilder(`search?jql=${encodedJQL}`, req)
      })
      .then(options => {
        return request(options).then((result) => {
          let issues = []
          for (let issue of result.issues) {
            issues.push(IssueViewModel.createFromJira(issue))
          }
          return res.send(issues)
        })
      })
  }
}

