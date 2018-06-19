export class Epic {
  constructor (obj) {
    this.id = ''
    this.key = ''
    this.name = ''
    this.summary = ''
    this.colour = ''
    this.issues = []
    Object.assign(this, obj)
  }

  get issuesWithChildren () {
    if (this.issues && this.issues.length) {
      return this.issues.filter(issue => issue.children.length > 0)
    }
    return []
  }

  get issuesWithoutChildren () {
    if (this.issues && this.issues.length) {
      return this.issues.filter(issue => issue.children.length === 0)
    }
    return []
  }
}
