import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { IssueService } from '../services/issues'
import { Issue } from '../models/issue'

@inject(DialogController)
export class IssueEditorDialog {
  constructor (controller) {
    this.controller = controller
    this.issue = new Issue()
    this.edit = false
  }

  activate(model) {
    if (model) {
      this.issue = Object.assign({}, model.issue)
      this.edit = model.edit
    }
  }

  get heading() {
    if (this.edit) {
      return 'Edit Issue'
    } else {
      return 'Create Issue'
    }
  }
}
