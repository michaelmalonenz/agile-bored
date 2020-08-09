module.exports = class UserViewModel {
  constructor () {
    this.id = 0
    this.externalId = ''
    this.displayName = ''
    this.username = ''
    this.avatarUrl = ''
    this.largeAvatarUrl = ''
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new UserViewModel()
      result.id = obj.accountId
      result.externalId = obj.accountId
      result.username = obj.name
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
      result.largeAvatarUrl = obj.avatar
      result.createdAt = obj.created
      result.updatedAt = obj.updated
    }
    return result
  }
}
