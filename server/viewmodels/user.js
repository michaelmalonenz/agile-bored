module.exports = class UserViewModel {
  constructor () {
    this.id = 0
    this.externalId = ''
    this.displayName = ''
    this.username = ''
    this.avatar = ''
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new UserViewModel()
      result.id = obj.accountId
      result.username = obj.username
      result.displayName = obj.displayName
      result.createdAt = obj.created
      result.updatedAt = obj.updated
      result.avatarUrl = obj.avatarUrls['24x24']
      result.largeAvatarUrl = obj.avatarUrls['48x48']
    }
    return result
  }

  static createFromLocal (obj) {
    let result
    if (obj) {
      result = new UserViewModel()
      result.id = obj.id
      result.externalId = obj.externalId
      result.username = obj.username
      result.displayName = obj.displayName
      result.avatarUrl = obj.avatar
      result.createdAt = obj.created
      result.updatedAt = obj.updated
    }
    return result
  }
}
