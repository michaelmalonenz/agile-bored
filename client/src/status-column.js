import { customElement, bindable, inject } from 'aurelia-framework'

@customElement('status-col')
@bindable('issues')
@bindable('status')
export class StatusColumn {

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
