import {bindable,customElement} from 'aurelia-framework'

@bindable('issues')
@customElement('sub-task-list')
export class SubTaskList {
    constructor () {
        this.diplay = null
    }

    displayTask (issue) {
        this.display = issue
    }

}
