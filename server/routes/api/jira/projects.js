const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const ProjectViewModel = require('../../../viewmodels/project')

module.exports = {
  get (req, res) {
    const id = req.params.projectId
    const options = jiraRequestBuilder.jira(`/project/${id}`, req)
    return request(options)
    .then(project => {
      res.send(ProjectViewModel.createFromJira(project))
    })
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
  }
}
