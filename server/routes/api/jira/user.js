const request = require('request-promise-native')
const avatarCache = require('./avatar-cache')
const jiraRequestBuilder = require('./jira-request')
const db = require('../../../models')
const url = require('url')
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
      })
  }
}
