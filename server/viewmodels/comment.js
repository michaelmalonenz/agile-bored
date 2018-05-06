const UserViewModel = require('./user')

module.exports = class CommentViewModel {
  constructor () {
    this.id = 0
    this.issueId = 0
    this.body = ''
    this.author = null
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new CommentViewModel()
      result.id = obj.id
      result.body = obj.body
      result.author = UserViewModel.createFromJira(obj.author)
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
      result.author = UserViewModel.createFromLocal(obj.author)
      result.createdAt = obj.created
      result.updatedAt = obj.updated
    }
    return result
  }
}
