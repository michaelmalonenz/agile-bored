export class Issue {
  constructor (issue) {
    this.id = null
    this.title = ''
    this.description = ''
    Object.assign(this, issue)
  }
}
