export class IssueType {
  constructor (it) {
    this.id = null
    this.name = ''
    this.colour = ''
    Object.assign(this, it)
  }
}
