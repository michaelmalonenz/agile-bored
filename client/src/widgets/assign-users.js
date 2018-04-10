import { bindable } from 'aurelia-framework'

@bindable('users')
export class AssignUsers {

  constructor () {
    this.active = false
  }

  slotClick() {
    this.active = true
  }
}
