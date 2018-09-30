const db = require('../../../models')
const op = db.Sequelize.Op
const IssueViewModel = require('../../../viewmodels/issue')
const EpicViewModel = require('../../../viewmodels/epic')

module.exports = {
  findAllIssues: function (req, res) {
    let props = _baseIssueQueryProps()
    props.where = {
      [op.or]: {
        'statusId': { [op.eq]: null },
        '$IssueStatus.name$': { [op.ne]: 'Done' }
      }
    }
    return _sendList(props, res)
  },
  issuesByEpic: function (req, res) {
    let props = _baseIssueQueryProps()
    props.where = {
      [op.or]: {
        'statusId': { [op.eq]: null },
        '$IssueStatus.name$': { [op.ne]: 'Done' }
      }
    }
    return _sendList(props, res)
  },
  backlog: function (req, res) {
    let props = _baseIssueQueryProps()
    props.where = {
      'statusId': { [op.eq]: null }
    }
    return _sendList(props, res)
  },
  get: function (req, res) {
    return db.Issue.findById(req.params.issueId, _baseIssueQueryProps())
      .then(dbIssue => {
        return IssueViewModel.createFromLocal(dbIssue.dataValues)
      })
      .then(result => res.send(result))
  },
  search: function (req, res) {
    let props = _baseIssueQueryProps()
    const terms = req.query.search.split(' ').map(t => `%${t}%`)
    props.where = {
      [op.or]: {
        'title': { [op.iLike]: { [op.any]: terms } },
        'description': { [op.iLike]: { [op.any]: terms } }
      },
      '$IssueStatus.name$': { [op.ne]: 'Done' }
    }
    return _sendList(props, res)
  },
  searchEpics: function (req, res) {
    const terms = req.query.search.split(' ').map(t => `%${t}%`)
    let props = {
      order: [['createdAt', 'ASC']],
      include: [{
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
      }],
      where: {
        [op.or]: {
          'title': { [op.iLike]: { [op.any]: terms } },
          'description': { [op.iLike]: { [op.any]: terms } }
        }
      },
      limit: 15
    }
    return db.Issue.findAll(props)
    .then(issues => {
      const result = []
      for (let issue of issues) {
        result.push(EpicViewModel.createFromLocal(issue.dataValues))
      }
      res.send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
  },
  updateStatus: function (req, res) {
    return db.Issue.update(
      { statusId: req.params.statusId },
      { where: { id: req.params.issueId } })
      .then(issue => {
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
    return db.Issue.update(
      { assigneeId: req.body.id },
      { where: { id: req.params.issueId } })
      .then((issue) => {
        res.send(issue)
      })
  },
  standup: function (req, res) {
    const date = new Date(req.params.date)
    // If today is Monday, then include the last 3 days, otherwise include the last day
    const dayCount = (date.getDay() === 1 ? 3 : 1)
    const doneAfterDate = new Date(new Date() - (dayCount * 24 * 60 * 60 * 1000))
    let props = _baseIssueQueryProps()
    props.where = {
      [op.or]: [{
        [op.and]: {
          '$IssueStatus.name$': { [op.and]: [ { [op.ne]: 'Done' }, { [op.ne]: null } ] }
        }
      }, {
        [op.and]: {
          '$IssueStatus.name$': { [op.eq]: 'Done' },
          'updatedAt': { [op.gte]: doneAfterDate }
        }
      }]
    }
    return _sendList(props, res)
  },
  create: function (req, res) {
    const dbIssue = _dbIssueFromRequest(req.body)
    dbIssue.reporterId = req.user.id
    return db.Issue.create(dbIssue)
      .then(issue => db.Issue.findById(issue.id, _baseIssueQueryProps()))
      .then(dbIssue => {
        return IssueViewModel.createFromLocal(dbIssue.dataValues)
      })
      .then(issue => res.send(issue))
  }
}

function _sendList (props, res) {
  return db.Issue.findAll(props)
    .then(issues => {
      const result = []
      for (let issue of issues) {
        result.push(IssueViewModel.createFromLocal(issue.dataValues))
      }
      res.send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
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
    }, {
      model: db.User,
      as: 'assignee',
      required: false
    }, {
      model: db.User,
      as: 'reporter',
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
