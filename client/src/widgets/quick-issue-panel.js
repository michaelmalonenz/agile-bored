import { inject, customElement } from 'aurelia-framework'
import { IssueService } from '../services/issues'
import { KEY_CODES } from '../utils/key-codes'
import { IssueViewModelFactory } from '../factories/issue-viewmodel-factory'

@inject(IssueService)
@customElement('quick-issue-panel')
export class QuickIssuePanel {
  constructor (issueService) {
    this.issueService = issueService
    this.value = ''
    this.disabled = false
    this.searching = false
  }

  async keyUp (event) {
    this.hasError = false
    if (event.keyCode === KEY_CODES.ESCAPE) {
      event.stopPropagation()
      this.value = ''
      return true
    } else if (event.keyCode === KEY_CODES.ENTER) {
      await this._search (event)
    }
  }

  async _search (event) {
    try {
      this.disabled = true
      this.searching = true
      const issue = await this.issueService.get(this.value)
      IssueViewModelFactory.create(issue).editIssue()
    } catch (_err) {
      this.hasError = true
    } finally {
      this.searching = false
      this.disabled = false
    }
  }

}
