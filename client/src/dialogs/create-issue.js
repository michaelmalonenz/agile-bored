import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { IssueService } from '../services/issues'
import { Issue } from '../models/issue'

@inject(DialogController)
export class CreateIssueDialog {
  constructor (controller) {
    this.controller = controller
    this.issue = new Issue()
  }

  activate(issue) {
    if (issue) this.issue = issue
  }
}
