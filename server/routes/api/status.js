const request = require('request-promise-native')
// const   db = require('../../models')

module.exports = function (router) {
  // router.get('/statuses', function (req, res) {
  //   return db.IssueStatus.findAll().then(statuses => {
  //     res.send(statuses)
  //   })
  // })

  router.get('/statuses', function (req, res) {
    var options = {
      uri: 'https://aranzgeo.atlassian.net/rest/api/2/project/PS/statuses',
      headers: {
        'Authorization': req.get('Authorization')
      },
      json: true // Automatically parses the JSON string in the response
    }
    request(options).then((statuses) => {
      return res.send(statuses)
    })
  })
}
