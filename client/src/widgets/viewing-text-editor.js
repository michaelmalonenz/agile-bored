import { bindable, customElement, inject, bindingMode } from 'aurelia-framework'

@bindable({
  name: 'value',
  defaultBindingMode: bindingMode.twoWay
})
@bindable('placeholder')
@bindable({
  name: 'startAsEdit',
  default: false
})
@inject(Element)
@customElement('viewing-text-editor')
export class ViewingTextEditor {
  constructor (element) {
    this.element = element
    this.editMode = false
  }

  bind () {
    this.editMode = this.startAsEdit
  }

  showIcons () {
    this.showingIcons = true
  }

  hideIcons () {
    this.showingIcons = false
  }

  startEditing () {
    this.editMode = true
    this.element.querySelector('textarea').focus()
  }

  stopEditing () {
    this.editMode = false
  }
}
