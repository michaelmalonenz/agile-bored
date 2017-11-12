const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  getStatuses: function (req, res) {
    return jiraRequestBuilder('project/PS/statuses', req).then(options => {
      return request(options).then((statuses) => {
        let storyStatuses
        for (let statusList of statuses) {
          if (statusList.name === 'Story') {
            storyStatuses = statusList.statuses
          }
        }
        return res.send(storyStatuses)
      })
    })
  }
}
