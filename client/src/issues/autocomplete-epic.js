import { computedFrom } from 'aurelia-framework'

export class AutocompleteEpic {
  constructor (epic) {
    this.epic = epic
  }

  @computedFrom('epic.colour')
  get style () {
    return `background-color: ${this.epic.colour};`
  }
}
