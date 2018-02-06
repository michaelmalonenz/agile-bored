import {ISSUE_DELETED} from './events'
import {IssueEditorDialog} from './dialogs/issue-editor'

export class Issue {
  constructor (i, dialogService, issueService, eventAggregator) {
    this.issue = i
    this.dialogService = dialogService
    this.issueService = issueService
    this.eventAggregator = eventAggregator
  }

  get issueId () {
    return this.issue.id
  }

  get typeStyle () {
    if (this.issue && this.issue.IssueType) {
      return `border-color: ${this.issue.IssueType.colour};`
    } else {
      return ''
    }
  }

  get avatarUrl () {
    if (this.issue && this.issue.assignee && this.issue.assignee.avatarUrls) {
      return this.issue.assignee.avatarUrls['24x24']
    } else {
      return ''
    }
  }

  get displayName () {
    if (this.issue && this.issue.assignee && this.issue.assignee.displayName) {
      return this.issue.assignee.displayName
    } else {
      return ''
    }
  }

  get hasChildren () {
    return this.issue.children && this.issue.children.length > 0
  }

  editIssue () {
    this.dialogService.open({ viewModel: IssueEditorDialog,
      lock: true,
      keyboard: ['Escape'],
      model: {
        issue: this.issue,
        edit: true
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.issueService.update(response.output).then(issue => {
          this.issue = issue
        })
      }
    })
  }

  deleteIssue () {
    return this.issueService.delete(this.issue).then(() => {
      this.eventAggregator.publish(ISSUE_DELETED, this.issue)
    })
  }

  updateStatus (status) {
    this.issueService.updateStatus(this.issue.id, status.id).then(() => {
      this.issue.IssueStatus = status
    })
  }
}
