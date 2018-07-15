import { inject, computedFrom } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

import { Issue } from '../models/issue'
import { SecuritySettings } from '../security/security-settings'
import { IssueTypeService } from '../services/issue-types'
import { IssueTypeViewmodel } from '../widgets/issue-type'

@inject(DialogController, IssueTypeService)
export class IssueEditorDialog {
  constructor (controller, issueTypeService) {
    this.controller = controller
    this.issueTypeService = issueTypeService
    this.issue = new Issue()
    this.edit = false
    this.issueTypes = []
  }

  async activate (model) {
    let subtask = false
    if (model) {
      this.original = model.issue
      this.issue = Object.assign({}, model.issue)
      this.edit = model.edit
      if (this.original.issueType != null) {
        subtask = this.original.issueType.subtask
      }
    }
    const rawTypes = await this.issueTypeService.getIssueTypes()
    this.issueTypes = rawTypes
      .filter(t => t.subtask === subtask)
      .map(t => new IssueTypeViewmodel(t))
  }

  @computedFrom('issue.title', 'issue.description', 'issue.issueType')
  get isModified () {
    if (this.edit) {
      return (this.original.title !== this.issue.title ||
        this.original.description !== this.issue.description ||
        !this.issueTypeMatcher(this.original.issueType, this.issue.issueType)
      )
    } else {
      return true
    }
  }

  get heading () {
    if (this.edit) {
      return `Edit Issue - ${this.issue.key}`
    } else {
      return 'Create Issue'
    }
  }

  issueTypeMatcher (a, b) {
    if (a == null && b == null) {
      return true
    }
    if (a == null || b == null) {
      return false
    }
    return a.id === b.id
  }

  save () {
    this.controller.ok(this.issue)
  }
}
