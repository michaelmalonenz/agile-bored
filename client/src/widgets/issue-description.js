import { customElement, bindable, bindingMode, inject } from 'aurelia-framework'

import { IssueService } from '../services/issues'

@inject(IssueService)
@bindable('issue')
@bindable({
  name: 'edit',
  defaultBindingMode: bindingMode.twoWay
})
@customElement('issue-description')
export class IssueDescription {
  constructor (issueService) {
    this.issueService = issueService
  }

  async updateStatus (status) {
    await this.issueService.updateStatus(this.issue.id, status.id)
    this.issue.issueStatus = status
  }
}
