const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')

const maxResults = 50

module.exports = {
  async cumulativeFlow (req, res) {
    const start = req.query.start
    const end = req.query.end
    const proj = req.settings.jiraProjectName
    const jql = encodeURIComponent(`project = ${proj} AND \
(created >= '${start}' AND created <= '${end}') OR \
(updated >= '${start}' AND updated <= '${end}' AND status = 'Done')`)
    const url = `/search?jql=${jql}&maxResults=${maxResults}`
    const options = jiraRequestBuilder.jira(url, req)
    const first = await request(options)
    const total = first.total
    let results = first.issues.slice(0)
    for (let current = maxResults; current < total; current += maxResults) {
      const options = jiraRequestBuilder.jira(`${url}&startAt=${current}`, req)
      const res = await request(options)
      results = results.concat(res.issues)
    }
    res.send(results)
  }
}
