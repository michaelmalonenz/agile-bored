const db = require('../../../models')
const op = db.Sequelize.Op
const EpicViewModel = require('../../../viewmodels/epic')

const INCLUDE_PROPS = [{
  model: db.IssueStatus,
  required: false,
  where: { 'name': { [op.ne]: 'Done' } }
}, {
  model: db.IssueType,
  where: { 'name': { [op.eq]: 'Epic' } }
}, {
  model: db.Comment,
  as: 'comments',
  required: false
}, {
  model: db.User,
  as: 'assignee',
  required: false
}, {
  model: db.User,
  as: 'reporter',
  required: false
}, {
  model: db.Issue,
  as: 'children',
  required: false
}]

module.exports = {
  get: function (req, res) {
    let props = {
      include: INCLUDE_PROPS
    }
    return db.Issue.findById(req.params.epicId, props)
      .then((epic) => {
        return EpicViewModel.createFromLocal(epic)
      })
  },
  searchEpics: function (req, res) {
    const terms = req.query.search.split(' ').map(t => `%${t}%`)
    let props = {
      order: [['createdAt', 'ASC']],
      include: INCLUDE_PROPS,
      where: {
        [op.and]: {
          '$IssueType.name$': { [op.eq]: 'Epic' },
          [op.or]: {
            'title': { [op.iLike]: { [op.any]: terms } },
            'description': { [op.iLike]: { [op.any]: terms } }
          }
        }
      },
      limit: 15
    }
    return db.Issue.findAll(props)
      .then(issues => {
        const result = []
        for (let epic of issues) {
          result.push(EpicViewModel.createFromLocal(epic.dataValues))
        }
        res.send(result)
      })
      .catch(err => {
        console.log(err)
        res.status(500).send(err)
      })
  }
}
