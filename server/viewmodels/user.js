export class UserViewModel {
  constructor () {
    this.id = 0
    this.displayName = ''
    this.avatarUrl = ''
    this.createdAt = Date.now()
    this.updatedAt = Date.now()
  }

  static createFromJira (obj) {
    let result
    if (obj) {
      result = new UserViewModel()
      result.id = obj.accountId
    }
    return result
  }

  static createFromLocal (obj) {

  }
}
