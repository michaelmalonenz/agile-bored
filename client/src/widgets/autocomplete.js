import {bindable, bindingMode, inject, TaskQueue, computedFrom} from 'aurelia-framework'

const KEY_ESCAPE = 27

@bindable({
  name: 'placeholder',
  defaultValue: '',
  defaultBindingMode: bindingMode.oneTime
})
@bindable({
  name: 'value',
  defaultValue: '',
  defaultBindingMode: bindingMode.oneWay
})
@bindable('search')
@bindable('select')
@bindable({
  name: 'compact',
  defaultValue: false,
  defaultBindingMode: bindingMode.oneTime
})
@bindable({
  name: 'selected',
  defaultValue: null,
  defaultBindingMode: bindingMode.twoWay
})
@bindable('view')
@inject(Element, TaskQueue)
export class Autocomplete {
  constructor (element, taskQueue) {
    this.element = element
    this.taskQueue = taskQueue
    this.value = ''
    this.placeholder = ''
    this.compact = false
    this.selected = null
    this.editing = false
    this.suggestions = []
    this.searching = false

    this.boundToggleEdit = this.toggleEdit.bind(this)
  }

  @computedFrom('suggestions')
  get haveSuggestions () {
    return !!this.suggestions.length
  }

  async keyUp (event) {
    if (event.keyCode === KEY_ESCAPE) {
      event.stopPropagation()
      this.toggleEdit()
      return true
    }
    await this._search (event)
  }

  toggleEdit () {
    this.editing = !this.editing
    if (this.editing) {
      this.taskQueue.queueMicroTask(() => {
        const inputElement = this.element.querySelector('.autocomplete input')
        if (inputElement) {
          inputElement.select()
          inputElement.focus()
        }
      })
      this.taskQueue.queueTask(() => {
        this._addDeactivateListeners()
      })
    } else {
      this._removeDeactivateListeners()
    }
  }

  _search (event) {
    if (typeof this.search === 'function') {
      this.searching = true
      const result = this.search({value: this.value, event: event})
      if (result && typeof result.then === 'function') {
        return result.then(suggestions => {
          this.searching = false
          this.suggestions = suggestions
        })
      } else {
        this.searching = false
        this.suggestions = result
      }
    }
    // Keep a consistent return type
    return Promise.resolve()
  }

  _select (suggestion, event) {
    if (typeof this.select === 'function') {
      this.select({value: suggestion, event: event})
    } else {
      this.selected = suggestion
    }
    this.toggleEdit()
  }

  _addDeactivateListeners () {
    document.addEventListener('click', this.boundToggleEdit)
  }

  _removeDeactivateListeners () {
    document.removeEventListener('click', this.boundToggleEdit)
  }
}
