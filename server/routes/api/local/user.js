const db = require('../../../models')

module.exports = {
  me: function (req, res) {
    db.User.findOne({ where: { id: req.session.user } })
      .then(user => {
        if (user) {
          res.send(user)
        } else {
          res.status(404).send('Not found')
        }
      })
      .catch(err => res.status(500).send(err.message))
  }
}
