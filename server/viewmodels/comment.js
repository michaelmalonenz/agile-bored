module.exports = class CommentViewModel {
  constructor () {
    this.id = 0
    this.issueId = 0
    this.body = ''
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new CommentViewModel()
      result.id = obj.id
      result.body = obj.body
      result.createdAt = obj.created
      result.updatedAt = obj.updated
    }
    return result
  }

  static createFromLocal (obj) {
    let result
    if (obj) {
      result = new CommentViewModel()
      result.id = obj.id
      result.body = obj.body
      result.createdAt = obj.created
      result.updatedAt = obj.updated
    }
    return result
  }
}
