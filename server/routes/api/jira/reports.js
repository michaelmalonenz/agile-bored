const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const moment = require('moment')

const maxResults = 150

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
    const options = jiraRequestBuilder.agile(`/epic/${req.query.epicId}/issue?expand=changelog`, req)
    return request(options)
      .then(result => {
        for (let issue of result.issues) {
          const events = []
          for (let history of issue.changelog.histories) {
            events.push(...ChangeLogViewModel.createFromJira(history))
          }
          const statusEvents = events.filter(e => e.field === 'status')
          statusEvents.sort((a, b) => a.timestamp - b.timestamp)
        }
        // const start = moment(statusEvents[0].timestamp)
        const start = result.fields.created
        const now = moment()
        const data = {}
        for (let current = start; current.isBefore(now); current.add(1, 'day')) {
          const currentDatum = {
            resolved: 0,
            inProgress: 0,
            toDo: 0
          }
          data[current.format('YYYY-MM-DD')] = currentDatum
        }
        res.send(data)
      })
  }
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
