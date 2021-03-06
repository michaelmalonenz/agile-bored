import { bindable, inject, customElement, bindingMode, computedFrom } from 'aurelia-framework'
import { AssigneeCache } from '../utils/assignees-cache'
import { IssueService } from '../services/issues';
import { UserService } from '../services/users';

@inject(Element, IssueService, UserService)
@bindable({
  name: 'assignee',
  defaultBindingMode: bindingMode.twoWay
})
@bindable({
  name: 'issueId',
  attribute: 'issue-id'
})
@bindable({
  name: 'large',
  defaultValue: false
})
@bindable({
  name: 'showUsername',
  attribute: 'show-username',
  defaultValue: false,
  defaultBindingMode: bindingMode.oneWay
})
@bindable({
  name: 'placement',
  defaultValue: 'bottom'
})
@customElement('assign-users')
export class AssignUsers {

  constructor (element, issueService, userService) {
    this.element = element
    this.issueService = issueService
    this.userService = userService
    this.active = false
    this.autocompleteElement = null
    this.searchText = ''
    this._users = AssigneeCache.getCachedAssignees()

    this.boundClickUser = this.clickUser.bind(this)
  }

  get hasAssignee () {
    return !!this.assignee
  }

  get avatarUrl () {
    if (this.assignee) {
      if (this.large && this.assignee.largeAvatarUrl) {
        return this.assignee.largeAvatarUrl
      } else if (!this.large && this.assignee.avatarUrl) {
        return this.assignee.avatarUrl
      }
    }
    return ''
  }

  get displayName () {
    if (this.assignee && this.assignee.displayName) {
      return this.assignee.displayName
    } else {
      return ''
    }
  }

  @computedFrom('large')
  get avatarStyle () {
    if (this.hasAssignee) {
      const size = this.large ? '48px' : '24px'
      return `height: ${size}; width: ${size}`
    } else {
      return ''
    }
  }

  @computedFrom('assignee', '_users')
  get users () {
    const filteredUsers = this._users.filter(u => {
      if (this.assignee) {
        return u.id !== this.assignee.id
      }
      return true
    })
    return filteredUsers.sort(function (a, b){
      if(a.displayName.toLowerCase() < b.displayName.toLowerCase()) return -1;
      if(a.displayName.toLowerCase() > b.displayName.toLowerCase()) return 1;
      return 0;
    })
  }

  clickUser (event) {
    if (event) {
      event.stopPropagation();
    }
    this.active = !this.active
    if (this.active) {
      this._addDeactivateListeners()
    } else {
      this._removeDeactivateListeners()
    }
  }

  async assignUser (event, user) {
    this.clickUser(event)
    this.assignee = user
    await this.issueService.assign(this.issueId, this.assignee)
  }

  async searchUsers (event) {
    event.stopPropagation();
    this._users = await this.userService.search(this.searchText)
    return true
  }

  ignoreClick (event) {
    event.target.focus()
    event.stopPropagation();
    return true
  }

  async keyUp (event) {
    if (event.which === 13) {
      await this.searchUsers(event)
    }
  }

  _addDeactivateListeners () {
    document.addEventListener('click', this.boundClickUser)
  }

  _removeDeactivateListeners () {
    document.removeEventListener('click', this.boundClickUser)
  }
}
