import {inject,customElement,bindable,bindingMode} from 'aurelia-framework'
import { StatusService } from '../services/statuses';

@bindable({
  name: 'updateFn',
  attribute: 'update-fn',
  defaultBindingMode: bindingMode.oneTime
})
@bindable('currentStatus')
@customElement('status-drop-down')
@inject(StatusService)
export class StatusDropDown {

  constructor (statusService) {
    this.statusService = statusService
    this.statuses = []
    this.currentStatus = null
  }

  async bind () {
    this.statuses = await this.statusService.findAllForProject()
  }

  statusMatcher (a, b) {
    return a.id === b.id
  }

  currentStatusChanged (newStatus, oldStatus) {
    if (oldStatus != null && newStatus.id !== oldStatus.id) {
      this.updateFn({status: newStatus})
    }
  }
}
