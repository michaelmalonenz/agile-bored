const db = require('../../../models')

module.exports = {
  findAllIssues: function (req, res) {
    return db.Issue.findAll({
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.IssueStatus,
        required: false
      }, {
        model: db.IssueType,
        required: false
      }],
      where: {
        $or: {
          'statusId': { $eq: null },
          '$IssueStatus.name$': { $ne: 'Done' }
        }
      }
    }).then(issues => {
      res.send(issues)
    })
  }
}
