const StatusViewModel = require('./status')
const IssueTypeViewModel = require('./issue-type')
const EpicViewModel = require('./epic')
const CommentViewModel = require('./comment')

module.exports = class IssueViewModel {
  constructor () {
    this.id = 0
    this.key = ''
    this.title = ''
    this.description = ''
    this.assignee = null
    this.IssueStatus = null
    this.IssueType = null
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
  }

  static createFromJira (obj, colorObj) {
    const result = new IssueViewModel()
    result.id = obj.id
    result.key = obj.key
    result.title = obj.fields.summary
    result.description = obj.fields.description
    result.assignee = obj.fields.assignee
    result.updatedAt = obj.fields.updated
    result.createdAt = obj.fields.created
    result.IssueStatus = StatusViewModel.createFromJira(obj.fields.status)
    result.issueType = IssueTypeViewModel.createFromJira(obj.fields.issuetype, colorObj)
    result.epic = EpicViewModel.createFromJira(obj.fields.epic)
    result.children = []
    result.comments = []
    const comments = obj.fields.comment ? obj.fields.comment.comments : []
    for (let comment of comments) {
      result.comments.push(CommentViewModel.createFromJira(comment))
    }
    return result
  }

  static createFromLocal (obj) {
    const result = new IssueViewModel()
    result.id = obj.id
    result.key = `AB-${obj.id}`
    result.title = obj.title
    result.description = obj.description
    result.updatedAt = obj.updatedAt
    result.createdAt = obj.createdAt
    result.assignee = null
    result.IssueStatus = StatusViewModel.createFromLocal(obj.IssueStatus)
    result.issueType = IssueTypeViewModel.createFromLocal(obj.IssueType)
    result.comments = []
    for (let comment of obj.comments) {
      result.comments.push(CommentViewModel.createFromLocal(comment))
    }
    return result
  }
}

