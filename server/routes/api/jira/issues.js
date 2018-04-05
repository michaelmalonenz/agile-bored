const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')
const settings = require('../../../settings')
const localCache = require('../../../local-cache')

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
            if (issue.fields.parent) {
              const parentId = issue.fields.parent.id
              let parent = issues.find(i => i.id === parentId)
              if (parent == null) {
                parent = IssueViewModel.createFromJira(issue.fields.parent)
                issues.push(parent)
              }
              parent.children.push(IssueViewModel.createFromJira(issue))
            } else {
              issues.push(IssueViewModel.createFromJira(issue))
            }
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
  },
  updateStatus: function (req, res) {
    const statuses = localCache.getCachedStatuses()
    return jiraRequestBuilder(`/issue/${req.params.issueId}/transitions`, req)
      .then(transitions => {
        // this is a thing
        res.send(200)
      })
  }
}

// https://aranzgeo.atlassian.net//rest/greenhopper/1.0/cardcolors/89/strategy/issuetype <- get card colours
