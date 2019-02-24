const db = require('../../../models')
const CommentViewModel = require('../../../viewmodels/comment')

module.exports = {
  getCommentsForIssue: function (req, res) {
    return db.Comment.findAll({
      where: { issueId: req.params.issueId },
      include: [{
        model: db.User,
        as: 'author'
      }]
    })
      .then(comments => {
        const result = []
        for (let comment of comments) {
          result.push(CommentViewModel.createFromLocal(comment))
        }
        res.send(result)
      })
  },
  addComment: function (req, res) {
    return db.Comment.create({
      body: req.body.body,
      authorId: req.user.id,
      issueId: req.params.issueId
    }).then(comment => {
      return db.Comment.findOne({
        where: { id: comment.id },
        include: [{
          model: db.User,
          as: 'author'
        }]
      }).then(comment => res.send(comment))
    }).catch(err => res.status(502).send(err))
  }
}
