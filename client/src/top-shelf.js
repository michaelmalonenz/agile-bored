import { inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { CreateIssueDialog } from 'dialogs/create-issue'

@inject(DialogService)
export class TopShelf {

  constructor(dialogService) {
    this.dialogService = dialogService
  }

  createIssue () {
    this.dialogService.open({ viewModel: CreateIssueDialog, lock: false}).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log(response.output)
      }
    })
  }
}
