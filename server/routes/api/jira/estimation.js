const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')

const ticksInADay = 24 * 60 * 60 * 1000

module.exports = {
  getEstimateForEpic: function (req, res) {
    const options = jiraRequestBuilder.agile(`/epic/${req.params.epicId}/issue?expand=changelog`, req)
    return request(options)
      .then(result => {
        const times = []
        for (let issue of result.issues) {
          const events = []
          for (let history of issue.changelog.histories) {
            events.push(...ChangeLogViewModel.createFromJira(history))
          }
          times.push(calculateTimeInProgress(events))
        }
        const days = Math.ceil(getEstimatedIssueDuration(times) / ticksInADay)
        res.send({ estimate: `${days} day${days === 1 ? '' : 's'}` })
      })
  }
}

const inProgressStatuses = ['Blocked', 'In Progress', 'Review', 'Test', 'To Deploy']

function calculateTimeInProgress (changelogEvents) {
  const statusEvents = changelogEvents.filter(e => e.field === 'status')
  statusEvents.sort((a, b) => a.timestamp - b.timestamp)
  let duration = 0
  let lastTimestamp = null
  for (let event of statusEvents) {
    if (lastTimestamp != null) {
      duration += (event.timestamp - lastTimestamp)
    }
    if (inProgressStatuses.includes(event.toValue)) {
      lastTimestamp = event.timestamp
    } else {
      lastTimestamp = null
    }
  }
  return duration
}

function getEstimatedIssueDuration (times) {
  const inProgressTimes = times.filter(t => t !== 0)
  if (inProgressTimes.length === 0) {
    return Infinity
  }
  inProgressTimes.sort((a, b) => a - b)
  const min = inProgressTimes[0]
  const max = inProgressTimes[inProgressTimes.length - 1]
  const total = inProgressTimes.reduce((prev, current) => prev + current, 0)
  const average = total / inProgressTimes.length
  return (min + (4 * average) + max) / 6
}

/**
 * TODO:
 * - Figure out if the issue is resolved (Can use issue's current status)
 * - Calculate max and min based on 'resolved', 'in progress', 'not started' time ordering
 * - Multiply the EstimatedIssueDuration by the count of unresolved issues
 * - Add settings for which statuses should be considered 'In Progress'
 **/
