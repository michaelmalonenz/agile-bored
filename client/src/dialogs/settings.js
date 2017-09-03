import { inject } from 'aurelia-framework'
import {DialogController} from 'aurelia-dialog'

@inject(DialogController)
export class SettingsDialog {

    constructor(controller) {
      this.controller = controller
    }

    activate (model) {
      if (model != null) {
        this.settings = model
      }
    }
}
