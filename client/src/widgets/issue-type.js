import {customElement,bindable} from 'aurelia-framework'

@bindable('issueType')
@customElement('issue-type')
export class IssueTypeViewmodel {
  constructor (issueType, small=false) {
    this.issueType = issueType
    this.small = small
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
