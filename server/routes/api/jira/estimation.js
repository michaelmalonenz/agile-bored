const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const { getGrowthRate, createTimeViewModel } = require('./helpers')
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
          times.push(createTimeViewModel(
            events,
            issue.fields.status.name,
            issue.fields.created)
          )
        }
        const averageDaysPerIssue = Math.ceil(getEstimatedIssueDuration(times) / ticksInADay)
        const incomplete = times.filter(t => !t.resolved)
        const days = averageDaysPerIssue * incomplete.length
        res.send({ estimate: getTimeString(days) })
      })
  }
}

function getEstimatedIssueDuration (times) {
  const inProgressTimes = times.filter(t => t.duration !== 0)
  if (inProgressTimes.length === 0) {
    return Infinity
  }
  const min = getMinimumDuration(inProgressTimes)
  const max = getMaximumDuration(inProgressTimes)
  const total = inProgressTimes.reduce((prev, current) => prev + current.duration, 0)
  const average = total / inProgressTimes.length
  const growthRate = getGrowthRate(times)
  return ((min + (4 * average) + max) / 6) * growthRate
}

function getMinimumDuration (times) {
  const completedIssues = times.filter(t => t.done)
  if (completedIssues.length) {
    return Math.min(...(completedIssues.map(t => t.duration)))
  }
  if (times.length) {
    return Math.min(...(times.map(t => t.duration)))
  }
  return 0
}

function getMaximumDuration (times) {
  const completedIssues = times.filter(t => t.done)
  if (completedIssues.length) {
    return Math.max(...(completedIssues.map(t => t.duration)))
  }
  if (times.length) {
    return Math.max(...(times.map(t => t.duration)))
  }
  return Infinity
}

function getTimeString (days) {
  let result = ''
  let weeks = 0
  let years = 0
  if (days > 7) {
    weeks = Math.floor(days / 7)
    days = days % 7
  }
  if (weeks > 52) {
    years = Math.floor(weeks / 52)
    weeks = weeks % 52
  }
  if (years > 0) {
    result += `${years} year${years === 1 ? '' : 's'} `
  }
  if (weeks > 0) {
    result += `${weeks} week${weeks === 1 ? '' : 's'} `
  }
  if (days > 0) {
    result += `${days} day${days === 1 ? '' : 's'}`
  }
  return result
}

/**
 * TODO:
 * - Add settings for which statuses should be considered 'In Progress'
 **/
