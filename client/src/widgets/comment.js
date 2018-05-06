import { bindable } from 'aurelia-framework'

@bindable('comment')
export class Comment {

  get date () {
    if (this.comment.updatedAt) {
      return this.comment.updatedAt
    } else {
      return this.comment.createdAt
    }
  }
}
