import { customElement, bindable } from 'aurelia-framework'

@customElement('status-col')
export class StatusColumn {

  @bindable issues
  @bindable status

  constructor () {
  }

  get statusIssues () {
    return this.issues.filter(x => {
      return (x.status == null && this.status.name === 'Todo') ||
        (x.status != null && x.status.name === this.status.name)
    })
  }
  
  dropInto (itemVM, siblingVM) {
    console.log("dropping off...")
  }
}
