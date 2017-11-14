const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

module.exports = {
  findAllIssues: function (req, res) {
    return jiraRequestBuilder('search?jql=project%20%3D%20PS%20AND%20status%20not%20in%20(Done%2C%20"To%20Do")%20order%20by%20priority%20ASC&fields=%22id,key,summary,description,assignee,fields,status,description%22', req).then(options => {
      return request(options).then((result) => {
        let issues = []
        for (let issue of result.issues) {
          issues.push({
            id: issue.id,
            key: issue.key,
            title: issue.fields.summary,
            description: issue.fields.description,
            assignee: issue.fields.assignee,
            IssueStatus: {
              id: issue.fields.status.id,
              name: issue.fields.status.name
            }
          })
        }
        return res.send(issues)
      })
    })
  }
}

