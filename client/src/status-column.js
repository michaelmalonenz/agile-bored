import { customElement, bindable } from 'aurelia-framework'

@customElement('status-col')
export class StatusColumn {

  @bindable issues
  @bindable status

  constructor () {
  }

  
}
