import { bindable, customElement, inject, bindingMode, TaskQueue } from 'aurelia-framework'

@bindable({
  name: 'value',
  defaultBindingMode: bindingMode.twoWay
})
@bindable('placeholder')
@bindable({
  name: 'startAsEdit',
  defaultValue: false
})
@inject(Element, TaskQueue)
@customElement('viewing-text-editor')
export class ViewingTextEditor {
  constructor (element, taskQueue) {
    this.element = element
    this.taskQueue = taskQueue
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
    this.taskQueue.queueMicroTask(() => {
      this.element.querySelector('textarea').focus()
    })
  }

  stopEditing () {
    this.editMode = false
  }
}
