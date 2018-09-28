import { inject, computedFrom } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

import { Issue } from '../models/issue'
import { IssueTypeService } from '../services/issue-types'
import { IssueService } from '../services/issues'
import { IssueTypeViewmodel } from '../widgets/issue-type'
import { AutocompleteEpic } from '../issues/autocomplete-epic';

@inject(DialogController, IssueTypeService, IssueService)
export class IssueEditorDialog {
  constructor (controller, issueTypeService, issueService) {
    this.controller = controller
    this.issueTypeService = issueTypeService
    this.issueService = issueService
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

  @computedFrom('issue.title', 'issue.description', 'issue.issueType', 'issue.epic')
  get isModified () {
    if (this.edit) {
      return (this.original.title !== this.issue.title ||
        this.original.description !== this.issue.description ||
        !this.issueTypeMatcher(this.original.issueType, this.issue.issueType) ||
        (this.original.epic != null && this.original.epic.id !== this.issue.epic.id) ||
        (this.original.epic == null && this.issue.epic)
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

  async epicSearch (value, _event) {
    return await this.issueService.searchEpics(value)
  }

}
