const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')
const settings = require('../../../settings')
const localCache = require('./local-cache')

module.exports = {
  findAllIssues: function (req, res) {
    return settings.jiraProjectName()
      .then(jiraProjectName => {
        const issueJQL = `project = ${jiraProjectName} AND status not in (Done, "To Do") order by priority ASC`
        const encodedJQL = encodeURIComponent(issueJQL)
        return jiraRequestBuilder.jira(`search?jql=${encodedJQL}&maxResults=100`, req)
      })
      .then(options => {
        return request(options).then((result) => {
          localCache.getCardColours(req).then(colours => {
            let issues = []
            for (let issue of result.issues) {
              let colour = colours.find(c => c.displayValue === issue.fields.issuetype.name)
              if (issue.fields.parent) {
                const parentId = issue.fields.parent.id
                let parent = issues.find(i => i.id === parentId)
                if (parent == null) {
                  parent = IssueViewModel.createFromJira(issue.fields.parent, colour)
                  issues.push(parent)
                }
                parent.children.push(IssueViewModel.createFromJira(issue, colour))
              } else {
                issues.push(IssueViewModel.createFromJira(issue, colour))
              }
            }
            return res.send(issues)
          })
        })
      })
      .catch(err => res.status(502).send(err))
  },
  get: function (req, res) {
    return settings.jiraProjectName()
      .then(jiraProjectName => {
        return jiraRequestBuilder(`/issue/${req.params.issueId}`)
      })
      .then(options => request(options))
      .then(issue => {
        return IssueViewModel.createFromJira(issue)
      })
      .then(result => res.send(result))
      .catch(err => res.status(502).send(err))
  },
  search: function (req, res) {
    return settings.jiraProjectName()
      .then(jiraProjectName => {
        const issueJQL = `project = ${jiraProjectName} AND status != Done AND (description ~ "${req.query.search}" OR summary ~ "${req.query.search}") order by priority ASC`
        const encodedJQL = encodeURIComponent(issueJQL)
        return jiraRequestBuilder.jira(`search?jql=${encodedJQL}`, req)
      })
      .then(options => request(options))
      .then((result) => {
        let issues = []
        for (let issue of result.issues) {
          issues.push(IssueViewModel.createFromJira(issue))
        }
        return res.send(issues)
      })
      .catch(err => res.status(502).send(err))
  },
  updateStatus: function (req, res) {
    return localCache.getCachedStatus(req.params.statusId)
      .then(status => {
        return jiraRequestBuilder.jira(`/issue/${req.params.issueId}/transitions`, req)
          .then(options => {
            return request(options).then(transitions => {
              const trans = transitions.transitions.find(t => t.name === status.name)
              return trans.id
            })
            .then(transitionId => {
              options.body = {
                transition: { id: transitionId }
              }
              options.method = 'POST'
              return request(options).then(result => res.sendStatus(200))
            })
          })
      })
      .catch(err => res.status(502).send(err))
  },
  update: function (req, res) {
    return jiraRequestBuilder.jira(`/issue/${req.params.issueId}`, req, 'PUT')
      .then(options => {
        options.body = {
          fields: {
            summary: req.body.title,
            description: req.body.description
          }
        }
        return request(options)
      })
      .then(() => res.send(req.body))
      .catch(err => res.status(502).send(err))
  },
  assign: function (req, res) {
    return jiraRequestBuilder.jira(`/issue/${req.params.issueId}/assignee`, req, 'PUT')
    .then(options => {
      options.body = {
        name: req.body.name
      }
      return request(options)
    })
    .then(() => res.sendStatus(200))
    .catch(err => res.status(502).send(err))
  }
}
