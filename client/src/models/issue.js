export class Issue {
  constructor (issue) {
    this.id = null
    this.title = ''
    this.description = ''
    this.assignee = {}
    this.children = []
    Object.assign(this, issue)
    if (issue) {
      this.updatedAt = new Date(issue.updatedAt)
      this.createdAt = new Date(issue.createdAt)
    }
  }
}
