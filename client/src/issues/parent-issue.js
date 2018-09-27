import {bindable,customElement,inject} from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog';
import { IssueService } from '../services/issues';
import {IssueEditorDialog} from '../dialogs/issue-editor'

@customElement('parent-issue')
@bindable('parent')
@bindable('statuses')
@inject(DialogService, IssueService)
export class ParentIssue {
  constructor(dialogService, issueService) {
    this.dialogService = dialogService
    this.issueService = issueService
  }

  editIssue () {
    this.dialogService.open({ viewModel: IssueEditorDialog,
      lock: true,
      keyboard: ['Escape'],
      model: {
        issue: this.parent.issue,
        edit: true
      }
    }).whenClosed(async response => {
      if (!response.wasCancelled) {
        this.parent.issue = await this.issueService.update(response.output)
      }
    })
  }
}
