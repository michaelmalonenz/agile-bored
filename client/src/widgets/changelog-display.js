import { bindable, inject, customElement } from 'aurelia-framework'
import { IssueService } from '../services/issues'

@customElement('changelog-display')
@bindable('issueId')
@inject(IssueService)
export class ChangeLogDisplay {
  constructor (issueService) {
    this.issueService = issueService
    this.changeLogs = []
  }

  async bind () {
    if (this.issueId) {
      this.loading = true
      this.changelogs = await this.issueService.getChangeLog(this.issueId)
      this.loading = false
    }
  }
}
