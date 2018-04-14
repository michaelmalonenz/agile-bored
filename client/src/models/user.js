export class User {
  constructor (user) {
    Object.assign(this, user)
  }

  get avatarUrl () {
    if (this.avatarUrls) {
      return this.avatarUrls['24x24']
    } else {
      return ''
    }
  }

}
