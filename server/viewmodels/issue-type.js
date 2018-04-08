module.exports = class IssueTypeViewModel {
  constructor () {
    this.id = ''
    this.colour = ''
    this.name = ''
  }

  static createFromJira (obj) {
    let res = new IssueTypeViewModel()
    if (obj) {
      res.id = Number(obj.value)
      res.colour = obj.color
      res.name = obj.displayValue
    }
    return res
  }

  static createFromLocal (obj) {
    let res = new IssueTypeViewModel()
    if (obj) {
      res.id = obj.id
      res.colour = obj.colour
      res.name = obj.name
    }
    return res
  }
}
