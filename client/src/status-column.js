import { customElement, bindable, inject } from 'aurelia-framework'

@customElement('status-col')
@bindable('issues')
@bindable('status')
export class StatusColumn {

  get statusIssues () {
    return this.issues.filter(x => {
      const issueStatus = x.issue ? x.issue.IssueStatus : x.IssueStatus
      return (issueStatus == null && this.status.name === 'Todo') ||
        (issueStatus != null && issueStatus.name === this.status.name)
    })
  }

  dropInto (issue, siblingIssue) {
    issue.updateStatus(this.status)
  }
}
