const request = require('request-promise-native')
const moment = require('moment')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const IssueViewModel = require('../../../viewmodels/issue')
const {
  createTimeViewModel,
  getEstimatedDaysRemaining
} = require('./helpers')

const inProgressStatuses = ['Blocked', 'In Progress', 'In Review', 'Test']
const resolvedStatuses = ['Done', 'Cancelled']

module.exports = {
  orgStats (req, res) {
    const jql = encodeURIComponent(
      `project = ${req.settings.jiraProjectName} AND status = Done AND type in (story, bug, task) AND updated > startOfDay("-30")`)
    const urlFragment = `/board/${req.settings.jiraRapidBoardId}/issue`
    const url = `${urlFragment}?expand=changelog&jql=${jql}&maxResults=100`
    const options = jiraRequestBuilder.agile(url, req)
    return request(options).then(result => {
      const times = []
      for (let issue of result.issues) {
        const events = []
        for (let history of issue.changelog.histories) {
          events.push(...ChangeLogViewModel.createFromJira(history))
        }
        const time = createTimeViewModel(
          events,
          issue.fields.status.name,
          issue.fields.created)
        time.key = issue.key
        time.title = issue.fields.summary
        times.push(time)
      }
      res.send(times)
    })
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
            const end = req.query.end ? moment(req.query.end, 'YYYY-MM-DD') : moment().endOf('day')
            const data = getEpicData(issues, start, end)
            const estimateDays = getEstimatedDaysRemaining(times)
            const estimateValues = data[end.format('YYYY-MM-DD')] || { toDo: 0, inProgress: 0 }
            const resultViewmodel = {
              data: data,
              estimate: {
                start: {
                  date: end.format('YYYY-MM-DD'),
                  value: estimateValues.toDo + estimateValues.inProgress
                },
                end: {
                  date: moment().add(estimateDays, 'days').format('YYYY-MM-DD'),
                  value: 0
                }
              }
            }
            res.send(resultViewmodel)
          })
      })
  }
}

function getEpicData (issues, start, end) {
  const data = {}
  for (let current = start; current.isSameOrBefore(end); current.add(1, 'day')) {
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
