import { singleton } from 'aurelia-framework'

@singleton()
export class AssigneeCache {

  constructor () {
    this.assignees = []
  }

  cacheUser (user) {
    this.assignees.push(user)
  }

  getCachedAssignees () {
    return this.assignees
  }
}
