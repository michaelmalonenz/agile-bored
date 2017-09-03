import { inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { IssueEditorDialog } from 'dialogs/issue-editor'
import { EventAggregator } from 'aurelia-event-aggregator'

import { IssueService } from '../services/issues'

@inject(DialogService, IssueService, EventAggregator)
export class TopShelf {

  constructor(dialogService, issueService, eventAggregator) {
    this.dialogService = dialogService
    this.issueService = issueService
    this.eventAggregator = eventAggregator
  }

  createIssue () {
    this.dialogService.open({
      viewModel: IssueEditorDialog,
      lock: true
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.issueService.create(response.output).then(issue => {
          this.eventAggregator.publish('issue-created', issue)
        })
      }
    })
  }
}
