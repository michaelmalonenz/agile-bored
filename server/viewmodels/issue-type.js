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
      result.id = Number(obj.value)
      result.colour = obj.color
      result.name = obj.displayValue
    }
    return result
  }

  static createFromLocal (obj) {
    let result
    if (obj) {
      result = new IssueTypeViewModel()
      result.id = obj.id
      result.colour = obj.colour
      result.name = obj.name
    }
    return result
  }
}
