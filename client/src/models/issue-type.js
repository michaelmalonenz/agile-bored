export class IssueType {
  constructor (it) {
    this.id = null
    this.name = ''
    this.colour = ''
    this.subtask = false
    Object.assign(this, it)
  }
}
