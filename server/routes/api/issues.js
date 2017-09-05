const db = require('../../models')

module.exports = function (router) {
  router.get('/issues', function (req, res) {
    return db.Issue.findAll({
      order: [['createdAt', 'ASC']],
      include: {
        model: db.IssueStatus,
        where: { 'name': { $ne: 'Done' } },
        required: false
      }
    }).then(issues => {
      res.send(issues)
    })
  })

  router.post('/issue', function (req, res) {
    return db.Issue.create(req.body).then(issue => {
      res.send(issue)
    })
  })

  router.put('/issue/:id', function (req, res) {
    return db.Issue.update(req.body, { where: { id: req.params.id } }).then(() => {
      res.send(req.body)
    })
  })

  router.put('/issue/:issueId/status/:statusId', function (req, res) {
    return db.Issue.update(
      { statusId: req.params.statusId },
      { where: { id: req.params.issueId } })
  })

  router.delete('/issue/:id', function (req, res) {
    return db.Issue.destroy({ where: { id: req.params.id } })
  })
}
