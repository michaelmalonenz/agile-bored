import { inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { IssueEditorDialog } from 'dialogs/issue-editor'
import { SettingsDialog } from 'dialogs/settings'
import { EventAggregator } from 'aurelia-event-aggregator'

import { IssueService } from '../services/issues'
import { SettingsService } from '../services/settings'
import { ISSUE_CREATED, REFRESH_BOARD } from '../events'

@inject(DialogService, IssueService, SettingsService, EventAggregator)
export class TopShelf {

  constructor(dialogService, issueService, settingsService, eventAggregator) {
    this.dialogService = dialogService
    this.issueService = issueService
    this.settingsService = settingsService
    this.eventAggregator = eventAggregator
  }

  createIssue () {
    this.dialogService.open({
      viewModel: IssueEditorDialog,
      lock: true
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.issueService.create(response.output).then(issue => {
          this.eventAggregator.publish(ISSUE_CREATED, issue)
        })
      }
    })
  }

  showSettings () {
    this.dialogService.open({
      viewModel: SettingsDialog,
      model: this.settingsService.get(),
      centerHorizontalOnly: true,
      lock: true
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.settingsService.update(response.output)
      }
    })
  }

  refreshBoard () {
    this.eventAggregator.publish(REFRESH_BOARD)
  }
}
