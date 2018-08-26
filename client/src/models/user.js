export class User {
  constructor (user) {
    Object.assign(this, user)
  }

  get avatarUrl () {
    if (this._avatarUrl) {
      return this._avatarUrl
    } else if (this.avatarUrls) {
      return this.avatarUrls['24x24']
    } else if (this.avatar) {
      return this.avatar
    } else {
      return ''
    }
  }

  set avatarUrl (value) {
    this._avatarUrl = value
  }

  get largeAvatarUrl () {
    if (this._largeAvatarUrl) {
      return this._largeAvatarUrl
    } else if (this.avatarUrls) {
      return this.avatarUrls['48x48']
    } else if (this.avatar) {
      return this.avatar
    } else {
      return ''
    }
  }

  set largeAvatarUrl (value) {
    this._largeAvatarUrl = value
  }

}
