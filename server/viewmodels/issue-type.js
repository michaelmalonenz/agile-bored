module.exports = class IssueTypeViewModel {
  constructor () {
    this.id = ''
    this.colour = ''
    this.name = ''
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new IssueTypeViewModel()
      result.id = obj.id
      result.name = obj.name
      result.colour = obj.color
      result.subtask = obj.subtask
    }
    return result
  }

  static createFromLocal (obj) {
    let result
    if (obj) {
      result = new IssueTypeViewModel()
      result.id = obj.id
      result.name = obj.name
      result.colour = obj.colour
      result.subtask = obj.subtask
    }
    return result
  }
}
