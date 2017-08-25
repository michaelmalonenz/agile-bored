import {CreateIssueDialog} from './dialogs/create-issue'

export class Issue {
  constructor (i, dialogService, issueService) {
    this.issue = i
    this.dialogService = dialogService
    this.issueService = issueService
  }

  editIssue () {
    this.dialogService.open({ viewModel: CreateIssueDialog,
      lock: true,
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
}
