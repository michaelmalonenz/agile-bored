import { bindable, customElement, inject, bindingMode } from 'aurelia-framework'

@bindable({
  name: 'value',
  defaultBindingMode: bindingMode.twoWay
})
@bindable('placeholder')
@inject(Element)
@customElement('viewing-text-editor')
export class ViewingTextEditor {
  constructor (element) {
    this.element = element
    this.editMode = false
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
