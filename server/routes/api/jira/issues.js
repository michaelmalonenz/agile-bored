const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const IssueViewModel = require('../../../viewmodels/issue')

const issueJQL = encodeURIComponent('project = PS AND status not in (Done, "To Do") order by priority ASC')

module.exports = {
  findAllIssues: function (req, res) {
    return jiraRequestBuilder(`search?jql=${issueJQL}`, req).then(options => {
      return request(options).then((result) => {
        let issues = []
        for (let issue of result.issues) {
          issues.push(IssueViewModel.createFromJira(issue))
        }
        return res.send(issues)
      })
    })
  }
}

