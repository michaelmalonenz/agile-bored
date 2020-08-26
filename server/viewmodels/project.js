module.exports = class ProjectViewModel {
  constructor () {
    this.id = 0
    this.key = ''
    this.avatarUrl = ''
    this.name = ''
  }

  static createFromLocal (obj) {
    const result = new ProjectViewModel()

    return result
  }

  static createFromJira (obj) {
    const result = new ProjectViewModel()
    result.id = obj.id
    result.key = obj.key
    result.avatarUrl = obj.avatarUrls['32x32']
    result.name = obj.name
    return result
  }
}
