import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController, Element)
export class StandUpDialog {

  constructor (controller, elem) {
    this.controller = controller
    this.element = elem
    this.inFullScreen = false
  }

  get contentHeight () {
    if (this.inFullScreen) { 
      return '85vh';
    } else {
      return '50vh';
    }
  }

  fullScreen () {
    const dialog = this.element.querySelector('.stand-up-dialog')
    const enterFn = dialog.requestFullscreen || dialog.webkitRequestFullscreen || dialog.mozRequestFullScreen
    if (enterFn) {
      this.inFullScreen = true
      enterFn.call(dialog)
    }
  }

  exitFullScreen () {
    const exitFn = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen
    if (exitFn) {
      exitFn.call(document)
      this.inFullScreen = false
    }
  }
}
