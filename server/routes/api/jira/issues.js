const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')
const EpicViewModel = require('../../../viewmodels/epic')
const statusApi = require('./status')
const cardColours = require('./card-colours')

module.exports = {
  findAllIssues: function (req, res) {
    const jql = encodeURIComponent('status not in (Cancelled,Done,"To Do") order by Rank ASC')
    const url = `/board/${req.settings.jiraRapidBoardId}/issue?maxResults=150&jql=${jql}`
    const options = jiraRequestBuilder.agile(url, req)
    return getIssues(options, req)
      .then(issues => {
        res.send(issues)
      })
      .catch(err => {
        console.log(err)
        res.status(502).send(err)
      })
  },
  issuesByEpic: function (req, res) {
    const jiraRapidBoardId = req.settings.jiraRapidBoardId
    const jql = encodeURIComponent('status not in (Cancelled,Done,"To Do") and type != Epic order by Rank ASC')
    const url = `/board/${jiraRapidBoardId}/issue?maxResults=150&jql=${jql}`
    const options = jiraRequestBuilder.agile(url, req)
    return getIssues(options, req)
      .then(issues => groupIssuesByEpic(issues, jiraRapidBoardId, req))
      .then(sortedIssues => {
        res.send(sortedIssues)
      })
      .catch(err => {
        console.log(err)
        res.status(502).send(err)
      })
  },
  backlog: function (req, res) {
    const url = `/board/${req.settings.jiraRapidBoardId}/backlog?maxResults=1000`
    const options = jiraRequestBuilder.agile(url, req)
    return getIssues(options, req)
      .then(issues => res.send(issues))
      .catch(err => res.status(502).send(err))
  },
  get: function (req, res) {
    return cardColours.getCardColours(req).then(colours => {
      const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}`, req)
      return request(options)
        .then(issue => {
          let colour = colours.find(c => c.displayValue === issue.fields.issuetype.name)
          return IssueViewModel.createFromJira(issue, colour)
        })
        .then(result => res.send(result))
        .catch(err => res.status(502).send(err))
    })
  },
  search: function (req, res) {
    const jql = `project = ${req.settings.jiraProjectName} AND status != Done AND (description ~ "${req.query.search}" OR summary ~ "${req.query.search}") order by priority ASC`
    return getIssuesByJQL(req, jql)
      .then(issues => res.send(issues))
      .catch(err => res.status(502).send(err))
  },
  searchEpics: function (req, res) {
    const term = (req.query.search || '').toLowerCase()
    return getEpics(req.settings.jiraRapidBoardId, req)
      .then(epics => {
        const results = []
        for (let epic of epics) {
          if ((epic.name && epic.name.toLowerCase().includes(term)) ||
              (epic.summary && epic.summary.toLowerCase().includes(term)) ||
              epic.key.toLowerCase().includes(term)) {
            results.push(EpicViewModel.createFromJira(epic))
          }
        }
        res.send(results)
      })
      .catch(err => res.status(502).send(err))
  },
  updateStatus: function (req, res) {
    return statusApi.retrieveStatuses(req, req.settings.jiraProjectName)
      .then(statuses => statuses.find(s => s.id === req.params.statusId))
      .then(status => {
        const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}/transitions`, req)
        return request(options)
          .then(transitions => {
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
      .catch(err => res.status(502).send(err))
  },
  update: function (req, res) {
    const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}`, req, 'PUT')
    const updater = req.body
    options.body = {
      fields: {
        summary: updater.title,
        description: updater.description,
        issuetype: { id: updater.issueType.id },
        [req.settings.jiraEpicField]: updater.epic ? updater.epic.key : null
      }
    }
    return request(options)
      .then(() => res.send(req.body))
      .catch(err => res.status(502).send(err))
  },
  assign: function (req, res) {
    const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}/assignee`, req, 'PUT')
    options.body = {
      name: req.body.name
    }
    return request(options)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(502).send(err))
  },
  standup: function (req, res) {
    const offset = Number(req.params.offset)
    const date = new Date(Date.now() + (offset * 60 * 1000))
    // If today is Monday, then include the last 3 days, otherwise include the last day
    let dayCount = (date.getDay() === 1 ? 3 : 1)
    const jql = encodeURIComponent(`type != Epic AND (status not in (Cancelled,Done,"To Do","Approved for Development") || (status = Done AND updated > startOfDay("-${dayCount}"))) order by Rank ASC`)
    const url = `/board/${req.settings.jiraRapidBoardId}/issue?maxResults=100&jql=${jql}`
    const options = jiraRequestBuilder.agile(url, req)
    return getIssues(options, req)
      .then(issues => sortStandUpIssues(issues, req.settings, req))
      .then((issues) => res.send(issues))
      .catch(err => {
        console.error(err)
        res.status(502).send(err)
      })
  },
  create: function (req, res) {
    const issueObj = req.body
    const options = jiraRequestBuilder.jira('/issue', req, 'POST')
    options.body = {
      fields: {
        reporter: { name: req.user.username },
        summary: issueObj.title,
        description: issueObj.description,
        project: { key: req.settings.jiraProjectName },
        issuetype: { id: issueObj.issueType.id }
      }
    }
    return request(options)
      .then(issue => {
        issueObj.key = issue.key
        issueObj.id = issue.id
        res.send(issueObj)
      })
      .catch(err => res.status(502).send(err))
  }
}

function getIssuesByJQL (req, jql) {
  const encodedJQL = encodeURIComponent(jql)
  const options = jiraRequestBuilder.jira(`search?jql=${encodedJQL}&maxResults=100`, req)
  return getIssues(options, req)
}

function getIssues (options, req) {
  return request(options).then(result => {
    return cardColours.getCardColours(req).then(colours => {
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
  const options = jiraRequestBuilder.agile(url, req)
  return request(options)
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
      sortChildren(issues, dbSettings, statuses)
      return issues.sort((a, b) => {
        if (dbSettings.groupIssuesByEpic) {
          if (a.epic && b.epic && a.epic.id !== b.epic.id) {
            if (a.epic.name > b.epic.name) {
              return 1
            } else if (a.epic.name < b.epic.name) {
              return -1
            } else {
              return 0
            }
          }
        }
        const aStatusIndex = statuses.findIndex(s => s.id === a.IssueStatus.id)
        const bStatusIndex = statuses.findIndex(s => s.id === b.IssueStatus.id)
        // We want descending order, so opposite world
        return bStatusIndex - aStatusIndex
      })
    })
}

function sortChildren (issues, settings, statuses) {
  for (let issue of issues) {
    if (issue.children) {
      issue.children = issue.children.sort((a, b) => {
        if (settings.groupIssuesByEpic) {
          if (a.epic && b.epic && a.epic.id !== b.epic.id) {
            if (a.epic.name > b.epic.name) {
              return 1
            } else if (a.epic.name < b.epic.name) {
              return -1
            } else {
              return 0
            }
          }
        }
        const aStatusIndex = statuses.findIndex(s => s.id === a.IssueStatus.id)
        const bStatusIndex = statuses.findIndex(s => s.id === b.IssueStatus.id)
        // We want descending order, so opposite world
        return bStatusIndex - aStatusIndex
      })
    }
  }
}
