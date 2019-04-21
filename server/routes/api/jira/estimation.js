const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const ChangeLogViewModel = require('../../../viewmodels/changelog')
const {
  createTimeViewModel,
  getEstimatedDaysRemaining,
  getTimeString
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

/**
 * TODO:
 * - Add settings for which statuses should be considered 'In Progress'
 **/
