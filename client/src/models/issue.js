export class Issue {
  constructor (issue) {
    this.id = null
    this.title = ''
    this.description = ''
    this.assignee = {}
    Object.assign(this, issue)
  }
}
