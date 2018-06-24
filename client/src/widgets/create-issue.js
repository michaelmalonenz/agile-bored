import { inject, customElement } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'

import { IssueService } from '../services/issues'
import { IssueEditorDialog } from '../dialogs/issue-editor'
import { ISSUE_CREATED } from '../events'

@customElement('create-issue-button')
@inject(EventAggregator, DialogService, IssueService)
export class CreateIssueButton {
  constructor (eventAggregator, dialogService, issueService) {
    this.eventAggregator = eventAggregator
    this.dialogService = dialogService
    this.issueService = issueService
  }

  createIssue () {
    this.dialogService.open({
      viewModel: IssueEditorDialog,
      lock: true
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        return this.issueService.create(response.output).then(issue => {
          this.eventAggregator.publish(ISSUE_CREATED, issue)
        })
      }
    })
  }
}
