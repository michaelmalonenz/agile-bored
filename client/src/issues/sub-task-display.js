import { bindable } from 'aurelia-framework'

@bindable('issue')
export class SubTaskDisplay {
  get issueType () {
    if (this.issue && this.issue.issue.issueType) {
      return this.issue.issue.issueType
    }
  }
}
