const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const {
  createTimeViewModel,
  getEstimatedDaysRemaining
} = require('./helpers')

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
        const days = getEstimatedDaysRemaining(times)
        res.send({ estimate: getTimeString(days) })
      })
  }
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
