import {bindable,customElement,inject} from 'aurelia-framework'
import {IssueService} from '../services/issues'

@bindable('issues')
@bindable('issueId')
@customElement('sub-task-list')
@inject(IssueService)
export class SubTaskList {
    constructor (issueService) {
        this.issueService = issueService
        this.diplay = null
    }

    async activate () {
        const unseen = await this.issueService.getUnseenSubtasks(this.issueId)
    }

    displayTask (issue) {
        this.display = issue
    }

}
