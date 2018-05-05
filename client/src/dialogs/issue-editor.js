import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

import { Issue } from '../models/issue'
import { SecuritySettings } from '../security/security-settings'
import { CommentService } from '../services/comments'

@inject(DialogController, CommentService)
export class IssueEditorDialog {
  constructor (controller, commentService) {
    this.controller = controller
    this.commentService = commentService
    this.issue = new Issue()
    this.edit = false
  }

  activate (model) {
    if (model) {
      this.issue = Object.assign({}, model.issue)
      this.edit = model.edit
    }
  }

  async bind () {
    this.comments = await this.commentService.findAllForIssue(this.issue.id)
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
