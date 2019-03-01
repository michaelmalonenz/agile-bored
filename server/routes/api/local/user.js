const db = require('../../../models')
const op = db.Sequelize.Op
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
  },

  search: function (req, res) {
    const searchTerm = req.query.term
    return db.User.findAll({
      where: {
        [op.or]: {
          'username': { [op.iLike]: `%${searchTerm}%` },
          'displayName': { [op.iLike]: `%${searchTerm}%` }
        }
      }
    }).then(users => {
      const result = []
      for (let user of users) {
        result.push(UserViewModel.createFromLocal(user.dataValues))
      }
      res.send(result)
    })
      .catch(err => {
        console.log(err)
        res.status(500).send(err)
      })
  }
}
