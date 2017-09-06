import {IssueEditorDialog} from './dialogs/issue-editor'

export class Issue {
  constructor (i, dialogService, issueService) {
    this.issue = i
    this.dialogService = dialogService
    this.issueService = issueService
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
    return this.issueService.delete(this.issue)
  }

  updateStatus (status) {
    this.issueService.updateStatus(this.issue.id, status.id).then(() => {
      this.issue.IssueStatus = status
    })
  }
}
