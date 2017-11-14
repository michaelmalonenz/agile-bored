module.exports = class StatusViewModel {
  constructor () {
    this.id = 0
    this.name = ''
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
  }

  static createFromJira (obj) {
    const result = new StatusViewModel()
    result.id = obj.id
    result.name = obj.name
    return result
  }

  static createFromLocal (obj) {
    const result = new StatusViewModel()
    result.id = obj.id
    result.name = obj.name
    return result
  }
}

