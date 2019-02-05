import { customElement, bindable, computedFrom } from 'aurelia-framework'

@customElement('status-col')
@bindable('issues')
@bindable('status')
export class StatusColumn {

  @computedFrom('issues')
  get statusIssues () {
    if (this.issues) {
      return this.issues.filter(x => {
        const issueStatus = x.issue ? x.issue.IssueStatus : x.IssueStatus
        return (issueStatus == null && this.status.name === 'Todo') ||
          (issueStatus != null && issueStatus.name === this.status.name)
      })
    } else {
      return []
    }
  }

  dropInto (issue, _siblingIssue) {
    issue.updateStatus(this.status)
  }
}
