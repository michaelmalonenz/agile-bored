module.exports = class CommentViewModel {
  constructor () {
    this.id = 0
    this.issueId = 0
    this.comment = ''
    this.updatedAt = new Date()
    this.createdAt = new Date()
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new CommentViewModel()
    }
    return result
  }
}
