const db = require('../../../models')
const op = db.Sequelize.Op
const IssueViewModel = require('../../../viewmodels/issue')

module.exports = {
  findAllIssues: function (req, res) {
    let props = _baseIssueQueryProps()
    props.where = {
      [op.or]: {
        'statusId': { [op.eq]: null },
        '$IssueStatus.name$': { [op.ne]: 'Done' }
      }
    }
    return db.Issue.findAll(props)
    .then(issues => {
      const result = []
      for (let issue of issues) {
        result.push(IssueViewModel.createFromLocal(issue.dataValues))
      }
      res.send(result)
    })
    .catch(err => res.status(500).send(err.message))
  },
  backlog: function (req, res) {
    let props = _baseIssueQueryProps()
    props.where = {
      'statusId': { [op.eq]: null }
    }
    return db.Issue.findAll(props)
    .then(issues => {
      const result = []
      for (let issue of issues) {
        result.push(IssueViewModel.createFromLocal(issue.dataValues))
      }
      res.send(result)
    })
    .catch(err => res.status(500).send(err.message))
  },
  get: function (req, res) {
    return db.Issue.findById(req.params.issueId, _baseIssueQueryProps())
      .then(dbIssue => {
        IssueViewModel.createFromLocal(dbIssue.dataValues)
      })
      .then(result => res.send(result))
  },
  search: function (req, res) {
    let props = _baseIssueQueryProps()
    const terms = req.query.search.split(' ').map(t => `%${t}%`)
    console.log(terms)
    props.where = {
      [op.or]: {
        'title': { [op.iLike]: { [op.any]: terms } },
        'description': { [op.iLike]: { [op.any]: terms } }
      }
    }
    return db.Issue.findAll(props)
    .then(issues => {
      const result = []
      for (let issue of issues) {
        result.push(IssueViewModel.createFromLocal(issue.dataValues))
      }
      res.send(result)
    })
    .catch(err => res.status(500).send(err.message))
  },
  updateStatus: function (req, res) {
    return db.Issue.update(
      { statusId: req.params.statusId },
      { where: { id: req.params.issueId } }).then(issue => {
        res.sendStatus(200)
      })
  },
  update: function (req, res) {
    const dbIssue = _dbIssueFromRequest(req.body)
    return db.Issue.update(dbIssue, { where: { id: req.params.issueId } }).then(() => {
      res.send(req.body)
    })
  },
  assign: function (req, res) {
    res.sendStatus(200)
  },
  create: function (req, res) {
    const dbIssue = _dbIssueFromRequest(req.body)
    return db.Issue.create(dbIssue)
      .then(issue => db.findById(issue.id, _baseIssueQueryProps()))
      .then(dbIssue => {
        IssueViewModel.createFromLocal(dbIssue.dataValues)
      })
      .then(issue => res.send(issue))
  }
}

function _baseIssueQueryProps () {
  return {
    order: [['createdAt', 'ASC']],
    include: [{
      model: db.IssueStatus,
      required: false
    }, {
      model: db.IssueType,
      required: false
    }, {
      model: db.Comment,
      as: 'comments',
      required: false
    }]
  }
}

function _dbIssueFromRequest (body) {
  const newIssueType = body.issueType || {}
  return {
    title: body.title,
    description: body.description,
    typeId: newIssueType.id
  }
}
