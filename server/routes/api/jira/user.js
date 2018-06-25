const request = require('request-promise-native')
const avatarCache = require('./avatar-cache')
const jiraRequestBuilder = require('./jira-request')
const db = require('../../../models')
const url = require('url')
const UserViewModel = require('../../../viewmodels/user')

module.exports = {
  me: function (req, res) {
    return jiraRequestBuilder.jira('/myself', req)
      .then(options => request(options))
      .then(user => {
        return avatarCache({
          uri: url.parse(user.avatarUrls['24x24'], true).query.d,
          encoding: null,
          headers: {
            'Authorization': req.get('Authorization')
          }
        })
        .then(avatar => {
          return db.User.findOrBuild({
            where: { externalId: user.accountId }
          })
          .spread((userObj, initialized) => {
            userObj.set({
              externalId: user.accountId,
              displayName: user.displayName,
              username: user.name,
              avatar: avatar.toString('base64')
            })
            res.send(UserViewModel.createFromLocal(userObj.get()))
            return userObj.save()
          })
        }).catch(err => {
          console.log(err)
          return res.sendStatus(503)
        })
      })
  }
}
