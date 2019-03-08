const UserViewModel = require('./user')

module.exports = class ChangeLogViewModel {
  constructor () {
    this.id = 0
    this.field = ''
    this.fromValue = null
    this.toValue = null
    this.author = null
    this.timestamp = new Date()
  }

  static createFromLocal (obj) {
    const log = new ChangeLogViewModel()
    if (obj) {
      log.id = obj.id
      log.author = UserViewModel.createFromLocal(obj.author)
      log.timestamp = new Date(obj.timestamp)
      log.field = obj.field
      log.fromValue = obj.oldValue
      log.toValue = obj.newValue
    }
    return log
  }

  static createFromJira (obj) {
    let result = []
    if (obj) {
      for (let item of obj.items) {
        const log = new ChangeLogViewModel()
        log.id = obj.id
        log.author = UserViewModel.createFromJira(obj.author)
        log.timestamp = new Date(obj.created)
        log.field = item.field
        log.fromValue = item.fromString
        log.toValue = item.toString
        result.push(log)
      }
    }
    return result
  }
}
