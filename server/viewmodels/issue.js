const StatusViewModel = require('./status')

module.exports = class IssueViewModel {
  constructor () {
    this.id = 0
    this.key = ''
    this.title = ''
    this.description = ''
    this.assignee = {}
    this.IssueStatus = {}
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
  }

  static createFromJira (obj) {
    const result = new IssueViewModel()
    result.id = obj.id
    result.key = obj.key
    result.title = obj.fields.summary
    result.description = obj.fields.description
    result.assignee = obj.fields.assignee
    result.IssueStatus = StatusViewModel.createFromJira(obj.fields.status)
    return result
  }

  static createFromLocal (obj) {
    const result = new IssueViewModel()
    result.id = obj.id
    result.key = obj.key
    result.title = obj.title
    result.description = obj.description
    result.assignee = {}
    result.IssueStatus = StatusViewModel.createFromLocal(obj.IssueStatus)
    return result
  }
}

