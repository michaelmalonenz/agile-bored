import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

import { Issue } from '../models/issue'
import { SecuritySettings } from '../security/security-settings'

@inject(DialogController)
export class IssueEditorDialog {
  constructor (controller) {
    this.controller = controller
    this.issue = new Issue()
    this.edit = false
  }

  activate (model) {
    if (model) {
      this.issue = Object.assign({}, model.issue)
      this.edit = model.edit
    }
  }

  get heading () {
    if (this.edit) {
      return 'Edit Issue'
    } else {
      return 'Create Issue'
    }
  }

  save () {
    this.issue.reporter = SecuritySettings.instance().user
    this.controller.ok(this.issue)
  }
}
