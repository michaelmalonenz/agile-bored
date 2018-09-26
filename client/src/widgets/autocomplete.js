import {bindable, bindingMode, inject} from 'aurelia-framework'

@bindable({
  name: 'placeholder',
  defaultValue: '',
  defaultBindingMode: bindingMode.oneTime
})
@bindable({
  name: 'value',
  defaultValue: '',
  defaultBindingMode: bindingMode.twoWay
})
@bindable('search')
@bindable('select')
@bindable({
  name: 'compact',
  defaultValue: false,
  defaultBindingMode: bindingMode.oneTime
})
@inject(Element)
export class Autocomplete {
  constructor (element) {
    this.value = ''
    this.placeholder = ''
    this.compact = false
    this.editing = false
    this.element = element
  }

  async keyUp (event) {
    await this._search (event)
  }

  toggleEdit () {
    this.editing = !this.editing
    if (this.editing) {
      setTimeout(() => {
        this.element.querySelector('.autocomplete .search-box').focus()
      }, 150)
    }
  }

  _search (event) {
    if (typeof this.search === 'function') {
      const result = this.search(this.value, event)
      if (result && typeof result.then === 'function') {
        return result.then(suggestions => {
          this.suggestions = suggestions
        })
      } else {
        this.suggestions = result
      }
    }
    // Keep a consistent return type
    return Promise.resolve()
  }

  _select (event) {
    if (typeof this.select === 'function') {
      this.select(this.value)
    }
    this.toggleEdit()
  }
}
