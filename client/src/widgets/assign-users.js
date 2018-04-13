import { bindable, inject, customElement } from 'aurelia-framework'
import { AssigneeCache } from '../utils/assignees-cache'

@bindable('assignee')
@customElement('assign-users')
@inject(AssigneeCache)
export class AssignUsers {

  constructor (assigneeCache) {
    this.assigneeCache = assigneeCache
    this.active = false
  }

  get avatarUrl () {
    if (this.assignee && this.assignee.avatarUrls) {
      return this.assignee.avatarUrls['24x24']
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
    return this.assigneeCache.getCachedAssignees()
  }

  clickUser () {
    this.active = !this.active
  }
}
