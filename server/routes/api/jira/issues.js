const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  findAllIssues: function (req, res) {
    var options = jiraRequestBuilder('search?jql=project=%22PS%22&fields=%22id,key,summary,description,fields,status,description%22', req)
    request(options).then((result) => {
      let issues = []
      for (let issue of result.issues) {
        issues.push({
          id: issue.id,
          key: issue.key,
          title: issue.fields.summary,
          description: issue.fields.description,
          IssueStatus: {
            id: issue.fields.status.id,
            name: issue.fields.status.name
          }
        })
      }
      res.send(issues)
    })
  }
}

