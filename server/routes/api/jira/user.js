const request = require('request-promise-native')
const jiraRequestBuilder = require('./jira-request')
const db = require('../../../models')
const UserViewModel = require('../../../viewmodels/user')

module.exports = {
  me: function (req, res) {
    if (req.get('Authorization') === 'Basic Og==') {
      res.status(401).send('Unauthorized')
      return Promise.resolve()
    }
    const options = jiraRequestBuilder.jira('/myself', req)
    return request(options)
      .then(user => {
        return db.User.findOrBuild({
          where: { jiraId: user.accountId }
        })
          .spread((userObj) => {
            userObj.set({
              jiraId: user.accountId,
              displayName: user.displayName,
              username: user.name,
              avatar: user.avatarUrls['24x24']
            })
            res.send(UserViewModel.createFromLocal(userObj.get()))
            return userObj.save()
          }).catch(err => {
            console.log(err)
            return res.sendStatus(503)
          })
      }).catch(err => {
        console.error(err)
        res.send(err, 401)
      })
  },

  search: function (req, res) {
    const url = `/user/assignable/search?query=${req.query.term}&project=${req.settings.jiraProjectName}&maxResults=10`
    const options = jiraRequestBuilder.jira(url, req)
    return request(options)
      .then(users => {
        const result = []
        for (let user of users) {
          result.push(UserViewModel.createFromJira(user))
        }
        res.send(result, 200)
      }).catch(err => {
        console.log(err)
        return res.sendStatus(502)
      })
  }
}
