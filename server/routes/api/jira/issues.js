const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')
const EpicViewModel = require('../../../viewmodels/epic')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const statusApi = require('./status')
const cardColours = require('./card-colours')
const MarkdownToJira = require('../../../viewmodels/markdown-to-jira')

module.exports = {
  findAllIssues: function (req, res) {
    const jql = encodeURIComponent('status not in (Cancelled,Done,"To Do") order by Rank ASC')
    const url = `/board/${req.settings.jiraRapidBoardId}/issue?maxResults=100&jql=${jql}`
    const options = jiraRequestBuilder.agile(url, req)
    return getIssues(options, req)
      .then(issues => {
        res.send(issues)
      })
      .catch(err => {
        console.error(err)
        res.status(502).send(err)
      })
  },
  issuesByEpic: function (req, res) {
    const jiraRapidBoardId = req.settings.jiraRapidBoardId
    const jql = encodeURIComponent('status not in (Cancelled,Done,"To Do") and type != Epic')
    const url = `/board/${jiraRapidBoardId}/issue?maxResults=100&jql=${jql}`
    const options = jiraRequestBuilder.agile(url, req)
    return getIssues(options, req)
      .then(issues => {
        const sortedIssues = groupIssuesByEpic(issues)
        res.send(sortedIssues)
      })
      .catch(err => {
        console.error(err)
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
    return getSingleIssue(req, req.params.issueId)
      .then(result => res.send(result))
      .catch(err => res.status(502).send(err))
  },
  search: function (req, res) {
    const excludeDoneTerm = 'status != Done AND'
    const matchKeyTerm = `OR key = '${req.query.search}'`
    const includeKey = /^[A-Za-z]+-[0-9]+$/.test(req.query.search)
    const jql = `\
project = ${req.settings.jiraProjectName} AND ${req.query.done === 'true' ? '' : excludeDoneTerm} \
(text ~ "${req.query.search}" OR comment ~ "${req.query.search}" \
${includeKey ? matchKeyTerm : ''}) \
AND created >= '${req.query.start}' AND created <= '${req.query.end}' \
order by priority ASC`
    return getIssuesByJQL(req, jql)
      .then(issues => res.send(issues))
      .catch(err => {
        console.error(err)
        res.status(502).send(err)
      })
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
        description: MarkdownToJira.convert(updater.description),
        issuetype: { id: updater.issueType.id },
        [req.settings.jiraEpicField]: updater.epic ? updater.epic.key : null
      }
    }
    return request(options)
      .then(() => getSingleIssue(req, req.params.issueId))
      .then(issue => res.send(issue))
      .catch(err => {
        console.error(err)
        res.status(502).send(err)
      })
  },
  assign: function (req, res) {
    const options = jiraRequestBuilder.jira(`/issue/${req.params.issueId}/assignee`, req, 'PUT')
    options.body = {
      name: req.body.username
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
    const jql = encodeURIComponent(`type != Epic AND (status not in (Cancelled,Done,"To Do") || (status = Done AND updated > startOfDay("-${dayCount}"))) ORDER BY Rank ASC`)
    const url = `/board/${req.settings.jiraRapidBoardId}/issue?maxResults=150&jql=${jql}`
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
        description: MarkdownToJira.convert(issueObj.description),
        project: { key: req.settings.jiraProjectName },
        issuetype: { id: issueObj.issueType.id },
        [req.settings.jiraEpicField]: issueObj.epic ? issueObj.epic.key : null
      }
    }
    if (issueObj.parentId) {
      options.body.fields.parent = { id: issueObj.parentId }
    }
    return request(options)
      .then(issue => {
        return getSingleIssue(req, issue.id)
          .then(newIssue => res.send(newIssue))
      })
      .catch(err => res.status(502).send(err.message))
  },
  getSubtasks: function (req, res) {
    const jql = `project = ${req.settings.jiraProjectName} AND parent = ${req.params.issueId} ORDER BY priority ASC`
    return getIssuesByJQL(req, jql)
      .then(issues => {
        if (issues && issues.length) {
          res.send(issues[0].children)
        } else {
          res.send([])
        }
      })
      .catch(err => res.status(502).send(err.message))
  },
  getChangeLog: function (req, res) {
    const options = jiraRequestBuilder.agile(`/issue/${req.params.issueId}?expand=changelog`, req)
    return request(options)
      .then(issue => {
        const result = []
        if (issue.changelog && issue.changelog.histories) {
          for (let log of issue.changelog.histories) {
            result.push(...(ChangeLogViewModel.createFromJira(log)))
          }
        }
        res.send(result)
      })
      .catch(err => res.status(502).send(err.message))
  }
}

function getIssuesByJQL (req, jql) {
  const encodedJQL = encodeURIComponent(jql)
  const urlFragment = `/board/${req.settings.jiraRapidBoardId}/issue`
  const options = jiraRequestBuilder.agile(`${urlFragment}?jql=${encodedJQL}&maxResults=100`, req)
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

function groupIssuesByEpic (issues) {
  const epics = []
  for (let issue of issues) {
    if (issue.epic && epics.find(e => e.id === issue.epic.id) == null) {
      const copy = Object.assign({}, issue.epic)
      epics.push(copy)
    }
  }
  const result = []
  for (let epic of epics) {
    let epicIssues = issues.filter(issue => issue.epic ? issue.epic.id === epic.id : false)
    if (epicIssues && epicIssues.length > 0) {
      epic.issues = epicIssues
      result.push(epic)
    }
  }
  const issuesWithNoEpic = issues.filter(issue => issue.epic == null)
  if (issuesWithNoEpic) {
    result.push(EpicViewModel.createNullEpic(issuesWithNoEpic))
  }
  return result.filter(e => e.issues && e.issues.length > 0)
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

function getSingleIssue (req, issueId) {
  const jiraRapidBoardId = req.settings.jiraRapidBoardId
  const jql = encodeURIComponent(`id=${issueId}`)
  const url = `/board/${jiraRapidBoardId}/issue?jql=${jql}`
  const options = jiraRequestBuilder.agile(url, req)
  return request(options).then(result => {
    return cardColours.getCardColours(req).then(colours => {
      let issue = result.issues[0]
      let colour = colours.find(c => c.displayValue === issue.fields.issuetype.name)
      const parent = IssueViewModel.createFromJira(issue, colour)
      if (issue.fields.subtasks) {
        for (let child of issue.fields.subtasks) {
          colour = colours.find(c => c.displayValue === child.fields.issuetype.name)
          parent.children.push(IssueViewModel.createFromJira(child, colour))
        }
      }
      return parent
    })
  })
}
