const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')
const EpicViewModel = require('../../../viewmodels/epic')
const settings = require('../../../settings')
const localCache = require('./local-cache')
const statusApi = require('./status')

module.exports = {
  findAllIssues: function (req, res) {
    return settings.jiraRapidBoardId()
      .then(jiraRapidBoardId => {
        const jql = encodeURIComponent('status not in (Done,"To Do") order by Rank ASC')
        const url = `/board/${jiraRapidBoardId}/issue?maxResults=100&jql=${jql}`
        return jiraRequestBuilder.agile(url, req)
      })
      .then(options => getIssues(options, req))
      .then(issues => {
        res.send(issues)
      })
      .catch(err => {
        console.log(err)
        res.status(502).send(err)
      })
  },
  issuesByEpic: function (req, res) {
    return settings.jiraRapidBoardId()
      .then(jiraRapidBoardId => {
        const jql = encodeURIComponent('status not in (Done,"To Do") order by Rank ASC')
        const url = `/board/${jiraRapidBoardId}/issue?maxResults=100&jql=${jql}`
        return jiraRequestBuilder.agile(url, req)
          .then(options => getIssues(options, req))
          .then(issues => groupIssuesByEpic(issues, jiraRapidBoardId, req))
          .then(sortedIssues => {
            res.send(sortedIssues)
          })
      })
      .catch(err => {
        console.log(err)
        res.status(502).send(err)
      })
  },
  backlog: function (req, res) {
    return settings.jiraRapidBoardId()
    .then(jiraRapidBoardId => {
      const url = `/board/${jiraRapidBoardId}/backlog?maxResults=1000`
      return jiraRequestBuilder.agile(url, req)
    })
    .then(options => getIssues(options, req))
    .then(issues => res.send(issues))
    .catch(err => res.status(502).send(err))
  },
  get: function (req, res) {
    return jiraRequestBuilder.jira(`/issue/${req.params.issueId}`)
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
      const jql = `project = ${jiraProjectName} AND status != Done AND (description ~ "${req.query.search}" OR summary ~ "${req.query.search}") order by priority ASC`
      return getIssuesByJQL(req, jql)
    })
    .then(issues => res.send(issues))
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
            description: req.body.description,
            issuetype: { id: req.body.issueType.id }
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
  },
  standup: function (req, res) {
    return settings.getSettings()
    .then(dbSettings => {
      const date = new Date(req.params.date)
      // If today is Monday, then include the last 3 days, otherwise include the last day
      let dayCount = (date.getDay() === 1 ? 3 : 1)
      const jql = encodeURIComponent(`type != Epic AND (status not in (Done,"To Do","Approved for Development") || (status = Done AND updated > startOfDay("-${dayCount}"))) order by Rank ASC`)
      const url = `/board/${dbSettings.jiraRapidBoardId}/issue?maxResults=100&jql=${jql}`
      return jiraRequestBuilder.agile(url, req)
        .then(options => getIssues(options, req))
        .then(issues => sortStandUpIssues(issues, dbSettings, req))
        .then((issues) => res.send(issues))
    })
    .catch(err => {
      console.error(err)
      res.status(502).send(err)
    })
  },
  create: function (req, res) {
    const issueObj = req.body
    return settings.jiraProjectName()
    .then(jiraProjectName => {
      return jiraRequestBuilder.jira('/issue', req, 'POST')
      .then(options => {
        options.body = {
          fields: {
            reporter: { name: issueObj.reporter.username },
            summary: issueObj.title,
            description: issueObj.description,
            project: { key: jiraProjectName },
            issuetype: { id: issueObj.issueType.id }
          }
        }
        return request(options)
      })
      .then(issue => {
        issueObj.key = issue.key
        issueObj.id = issue.id
        res.send(issueObj)
      })
    }).catch(err => res.status(502).send(err))
  }
}

function getIssuesByJQL (req, jql) {
  const encodedJQL = encodeURIComponent(jql)
  return jiraRequestBuilder.jira(`search?jql=${encodedJQL}&maxResults=100`, req)
    .then(options => getIssues(options, req))
}

function getIssues (options, req) {
  return request(options).then(result => {
    return localCache.getCardColours(req).then(colours => {
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
      return issues
    })
  })
}

function getEpics (jiraRapidBoardId, req) {
  const url = `/board/${jiraRapidBoardId}/epic?done=false`
  return jiraRequestBuilder.agile(url, req)
    .then(options => request(options))
    .then(response => response.values)
}

function groupIssuesByEpic (issues, jiraRapidBoardId, req) {
  const epics = []
  return getEpics(jiraRapidBoardId, req)
    .then(boardEpics => {
      for (let epic of boardEpics) {
        let epicIssues = issues.filter(issue => issue.epic ? issue.epic.id === epic.id : false)
        if (epicIssues && epicIssues.length > 0) {
          let e = EpicViewModel.createFromJira(epic)
          e.issues = epicIssues
          epics.push(e)
        }
      }
      const issuesWithNoEpic = issues.filter(issue => issue.epic == null)
      if (issuesWithNoEpic) {
        epics.push(EpicViewModel.createNullEpic(issuesWithNoEpic))
      }
      return epics.filter(e => e.issues && e.issues.length > 0)
    })
}

function sortStandUpIssues (issues, dbSettings, req) {
  return statusApi.retrieveStatuses(req, dbSettings.jiraProjectName)
    .then(statuses => {
      return issues.sort((a, b) => {
        const aStatusIndex = statuses.findIndex(s => s.id === a.IssueStatus.id)
        const bStatusIndex = statuses.findIndex(s => s.id === b.IssueStatus.id)
        // We want descending order, so opposite world
        return bStatusIndex - aStatusIndex
      })
    })
}
