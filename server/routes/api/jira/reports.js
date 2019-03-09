const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  cumulativeFlow (req, res) {
    const id = req.params.projectId
    const options = jiraRequestBuilder.jira(`/project/${id}`, req)
    return request(options)
      .then(project => {
        res.send({})
      })
      .catch(err => {
        console.error(err)
        res.status(500).send(err)
      })
  }
}
