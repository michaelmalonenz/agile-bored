import { bindable, inject, customElement } from 'aurelia-framework'
import { AssigneeCache } from '../utils/assignees-cache'
import { UserService } from '../services/users';

@inject(Element, UserService)
@bindable('assignee')
@customElement('assign-users')
export class AssignUsers {

  constructor (element, userService) {
    this.element = element
    this.userService = userService
    this.active = false
    this.autocompleteElement = null
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
  }

  assignUser (user) {
    this.clickUser()
    this.assignee = user
    console.log(user.displayName, user)
  }

  unassign () {
    this.clickUser()
    this.assignee = null
  }
}
