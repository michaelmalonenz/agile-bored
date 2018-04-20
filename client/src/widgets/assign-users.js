import { bindable, inject, customElement, bindingMode } from 'aurelia-framework'
import { AssigneeCache } from '../utils/assignees-cache'
import { IssueService } from '../services/issues';

@inject(Element, IssueService)
@bindable({
  name: 'assignee',
  defaultBindingMode: bindingMode.twoWay
})
@bindable({
  name: 'issueId',
  attribute: 'issue-id'
})
@customElement('assign-users')
export class AssignUsers {

  constructor (element, issueService) {
    this.element = element
    this.issueService = issueService
    this.active = false
    this.autocompleteElement = null

    this.boundClickUser = this.clickUser.bind(this)
  }

  get hasAssignee () {
    return !!this.assignee
  }

  get avatarUrl () {
    if (this.assignee && this.assignee.avatarUrl) {
      return this.assignee.avatarUrl
    } else {
      return ''
    }
  }

  get displayName () {
    if (this.assignee && this.assignee.displayName) {
      return this.assignee.displayName
    } else {
      return ''
    }
  }

  get users () {
    return AssigneeCache.getCachedAssignees().sort(function (a, b){
      if(a.displayName.toLowerCase() < b.displayName.toLowerCase()) return -1;
      if(a.displayName.toLowerCase() > b.displayName.toLowerCase()) return 1;
      return 0;
    })
  }

  clickUser () {
    this.active = !this.active
    if (this.active) {
      this._addDeactivateListeners()
    } else {
      this._removeDeactivateListeners()
    }
  }

  async assignUser (user) {
    this.clickUser()
    this.assignee = user
    await this.issueService.assign(this.issueId, this.assignee)
  }

  _addDeactivateListeners () {
    document.addEventListener('click', this.boundClickUser)
  }

  _removeDeactivateListeners () {
    document.removeEventListener('click', this.boundClickUser)
  }
}
