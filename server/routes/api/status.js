const request = require('request-promise-native')
const jiraRequestBuilder = require('../../utils/jira-request')
// const   db = require('../../models')

module.exports = function (router) {
  // router.get('/statuses', function (req, res) {
  //   return db.IssueStatus.findAll().then(statuses => {
  //     res.send(statuses)
  //   })
  // })

  router.get('/statuses', function (req, res) {
    var options = jiraRequestBuilder('project/PS/statuses', req)
    request(options).then((statuses) => {
      return res.send(statuses)
    })
  })
}
