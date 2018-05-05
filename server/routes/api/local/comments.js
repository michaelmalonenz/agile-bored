const db = require('../../../models')
const CommentViewModel = require('../../../viewmodels/comment')

module.exports = {
  getCommentsForIssue: function (req, res) {
    return db.Comment.findAll({ where: { issueId: req.params.issueId } })
      .then(comments => {
        const result = []
        for (let comment of comments) {
          result.push(CommentViewModel.createFromLocal(comment))
        }
        res.send(result)
      })
  }
}
