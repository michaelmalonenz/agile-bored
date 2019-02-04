import { customElement, bindable, bindingMode, inject } from 'aurelia-framework'

import { IssueService } from '../services/issues'

@inject(IssueService)
@bindable({
  name: 'issue',
  defaultBindingMode: bindingMode.twoWay
})
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
    this.issue = await this.issueService.get(this.issue.id)
  }
}
