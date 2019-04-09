const StatusViewModel = require('./status')
const IssueTypeViewModel = require('./issue-type')
const EpicViewModel = require('./epic')
const CommentViewModel = require('./comment')
const UserViewModel = require('./user')
const JiraToMarkdown = require('./jira-to-markdown')
const AttachmentViewModel = require('./attachment')

module.exports = class IssueViewModel {
  constructor () {
    this.id = 0
    this.key = ''
    this.title = ''
    this.description = ''
    this.assignee = null
    this.reporter = null
    this.IssueStatus = null
    this.IssueType = null
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
    this.children = []
    this.comments = []
    this.attachments = []
    this.tags = []
  }

  static createFromJira (obj, colorObj) {
    const result = new IssueViewModel()
    if (obj.fields.attachment) {
      for (let attachment of obj.fields.attachment) {
        result.attachments.push(AttachmentViewModel.createFromJira(attachment))
      }
    }
    result.id = obj.id
    result.key = obj.key
    result.title = obj.fields.summary
    result.description = JiraToMarkdown.convert(obj.fields.description, result.attachments)
    result.assignee = UserViewModel.createFromJira(obj.fields.assignee)
    result.reporter = UserViewModel.createFromJira(obj.fields.reporter)
    result.updatedAt = obj.fields.updated
    result.createdAt = obj.fields.created
    result.IssueStatus = StatusViewModel.createFromJira(obj.fields.status)
    result.issueType = IssueTypeViewModel.createFromJira(obj.fields.issuetype, colorObj)
    result.epic = EpicViewModel.createFromJira(obj.fields.epic)
    result.tags = obj.fields.labels ? obj.fields.labels : []
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
    result.assignee = UserViewModel.createFromLocal(obj.assignee)
    result.reporter = UserViewModel.createFromLocal(obj.reporter)
    result.IssueStatus = StatusViewModel.createFromLocal(obj.IssueStatus)
    result.issueType = IssueTypeViewModel.createFromLocal(obj.IssueType)
    for (let comment of obj.comments) {
      result.comments.push(CommentViewModel.createFromLocal(comment))
    }
    if (obj.children) {
      for (let child of obj.children) {
        result.children.push(IssueViewModel.createFromLocal(child))
      }
    }
    return result
  }
}
