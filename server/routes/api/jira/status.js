const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const StatusViewModel = require('../../../viewmodels/status')

module.exports = {
  getStatuses: function (req, res) {
    return jiraRequestBuilder('project/PS/statuses', req).then(options => {
      return request(options).then((statuses) => {
        const result = []
        for (let statusList of statuses) {
          if (statusList.name === 'Story') {
            for (let status of statusList.statuses) {
              result.push(StatusViewModel.createFromJira(status))
            }
          }
        }
        return res.send(result)
      })
    })
  }
}
