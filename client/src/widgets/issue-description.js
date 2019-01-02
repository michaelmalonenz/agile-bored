import { customElement, bindable, bindingMode } from 'aurelia-framework'

@bindable('issue')
@bindable({
  name: 'edit',
  defaultBindingMode: bindingMode.twoWay
})
@customElement('issue-description')
export class IssueDescription {

}
