import { customElement, bindable, inject } from 'aurelia-framework'

@customElement('status-col')
export class StatusColumn {

  @bindable issues
  @bindable status

  constructor () {
  }

  get statusIssues () {
    return this.issues.filter(x => {
      return (x.issue.IssueStatus == null && this.status.name === 'Todo') ||
        (x.issue.IssueStatus != null && x.issue.IssueStatus.name === this.status.name)
    })
  }
  
  dropInto (issue, siblingIssue) {
    issue.updateStatus(this.status)
  }
}
