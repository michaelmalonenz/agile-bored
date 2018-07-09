const jiraRequestBuilder = require('./jira-request')
const IssueTypeViewModel = require('../../../viewmodels/issue-type')
const cachedRequest = require('./cached-request')
const cardColours = require('./card-colours')

module.exports = {
  getIssueTypes: function (req, res) {
    const options = jiraRequestBuilder.jira(`project/${req.settings.jiraProjectName}`, req)
    return cachedRequest(options)
      .then(project => {
        return cardColours.getCardColours(req)
          .then((colours) => {
            const result = []
            for (let issueType of project.issueTypes) {
              let colour = colours.find(c => c.displayValue === issueType.name)
              result.push(IssueTypeViewModel.createFromJira(issueType, colour))
            }
            res.send(result)
          })
      })
      .catch(err => res.status(502).send(err))
  }
}
