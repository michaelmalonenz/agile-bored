import { bindable, inject, customElement } from 'aurelia-framework'
import { AssigneeCache } from '../utils/assignees-cache'

@inject(Element)
@bindable('assignee')
@customElement('assign-users')
export class AssignUsers {

  constructor (element) {
    this.element = element
    this.active = false
    this.autocompleteElement = null
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

  _removeAssigneeAutocomplete () {
    let cont = document.querySelector('.autocomplete-container')
    cont.parentNode.removeChild(cont)
  }

  getOffset (el) {
    let cols = document.querySelector('.status-cols-area')
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + cols.scrollLeft,
      top: rect.top + cols.scrollTop,
      bottom: rect.top + Number(el.style.height) + cols.scrollTop
    }
  }
}
