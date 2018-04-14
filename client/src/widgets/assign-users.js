import { bindable, inject, customElement } from 'aurelia-framework'
import { AssigneeCache } from '../utils/assignees-cache'

@bindable('assignee')
@customElement('assign-users')
export class AssignUsers {

  constructor () {
    this.active = false
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
    return AssigneeCache.getCachedAssignees()
  }

  clickUser () {
    this.active = !this.active
  }

  getOffset (el) {
    el = el.getBoundingClientRect();
    return {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY
    }
  }
}
