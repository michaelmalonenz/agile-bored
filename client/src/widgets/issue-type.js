import {customElement,bindable} from 'aurelia-framework'

@bindable('issueType')
@customElement('issue-type')
export class IssueTypeViewmodel {
  constructor (issueType) {
    this.issueType = issueType
  }

  get model () {
    return this.issueType
  }

  matches (issueType) {
    if (issueType == null) {
      return false
    }
    return this.issueType.id === issueType.id
  }
}
