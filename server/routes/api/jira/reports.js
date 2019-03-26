const request = require('request-promise-native')
const moment = require('moment')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const IssueViewModel = require('../../../viewmodels/issue')
const {
  createTimeViewModel,
  getEstimatedDaysRemaining
} = require('./helpers')

const maxResults = 150

const inProgressStatuses = ['Blocked', 'In Progress', 'Review', 'Test']
const resolvedStatuses = ['Done', 'Cancelled']

module.exports = {
  async cumulativeFlow (req, res) {
    const start = req.query.start
    const end = req.query.end
    const proj = req.settings.jiraProjectName
    const jql = encodeURIComponent(`project = ${proj} AND \
((created >= '${start}' AND created <= '${end}') OR \
(updated >= '${start}' AND updated <= '${end}'))`)
    const url = `/search?jql=${jql}&maxResults=${maxResults}`
    const options = jiraRequestBuilder.jira(url, req)
    const first = await request(options)
    const total = first.total
    let results = first.issues.slice(0)
    for (let current = maxResults; current < total; current += maxResults) {
      const options = jiraRequestBuilder.jira(`${url}&startAt=${current}`, req)
      const res = await request(options)
      results = results.concat(res.issues)
    }
    res.send(collateResults(results))
  },
  epicRemaining (req, res) {
    const options = jiraRequestBuilder.jira(`/issue/${req.query.epicId}`, req)
    return request(options)
      .then(epic => {
        const options = jiraRequestBuilder.agile(`/epic/${req.query.epicId}/issue?expand=changelog`, req)
        return request(options)
          .then(result => {
            const issues = []
            const times = []
            for (let issue of result.issues) {
              const events = []
              for (let history of issue.changelog.histories) {
                events.push(...ChangeLogViewModel.createFromJira(history))
              }
              times.push(createTimeViewModel(
                events,
                issue.fields.status.name,
                issue.fields.created)
              )
              const statusEvents = events.filter(e => e.field === 'status')
              statusEvents.sort((a, b) => a.timestamp - b.timestamp)
              const current = IssueViewModel.createFromJira(issue)
              current.changelog = statusEvents
              issues.push(current)
            }
            const start = req.query.start ? moment(req.query.start, 'YYYY-MM-DD') : moment(epic.fields.created)
            const end = req.query.end ? moment(req.query.end, 'YYYY-MM-DD') : moment()
            const data = getEpicData(issues, start, end)
            const estimateDays = getEstimatedDaysRemaining(times)
            const resultViewmodel = {
              data: data,
              estimatedCompletion: moment().add(estimateDays, 'days').toISOString()
            }
            res.send(resultViewmodel)
          })
      })
  }
}

function getEpicData (issues, start, end) {
  const data = {}
  for (let current = start; current.isBefore(end); current.add(1, 'day')) {
    const currentDatum = {
      resolved: 0,
      inProgress: 0,
      toDo: 0
    }
    for (let issue of issues) {
      let status
      if (moment(issue.createdAt).isAfter(current)) {
        continue
      }
      for (let statusEvent of issue.changelog) {
        status = statusEvent.toValue
        if (moment(statusEvent.timestamp).isAfter(current)) {
          status = statusEvent.fromValue
          break
        }
      }
      if (resolvedStatuses.includes(status)) {
        currentDatum.resolved++
      } else if (inProgressStatuses.includes(status)) {
        currentDatum.inProgress++
      } else {
        currentDatum.toDo++
      }
    }
    data[current.format('YYYY-MM-DD')] = currentDatum
  }
  return data
}

function collateResults (results) {
  let closedCount = 0
  for (let issue of results) {
    if (issue.fields.status.name === 'Done' || issue.fields.status.name === 'Cancelled') {
      closedCount++
    }
  }
  return {
    total: results.length,
    closed: closedCount,
    notDone: results.length - closedCount,
    growth: +((results.length - closedCount) / closedCount).toFixed(2)
  }
}
