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
