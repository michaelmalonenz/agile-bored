const db = require('../../../models')
const UserViewModel = require('../../../viewmodels/user')

module.exports = {
  me: function (req, res) {
    db.User.findOne({ where: { id: req.user.id } })
      .then(user => {
        if (user) {
          res.send(UserViewModel.createFromLocal(user))
        } else {
          res.status(404).send('Not found')
        }
      })
      .catch(err => res.status(500).send(err.message))
  }
}
