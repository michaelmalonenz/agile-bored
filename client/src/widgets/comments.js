import { customElement, bindable, inject } from 'aurelia-framework'

import { CommentService } from '../services/comments'

@bindable('comments')
@bindable('issueId')
@customElement('comments')
@inject(CommentService)
export class Comments {
  constructor (commentService) {
    this.commentService = commentService
    this.loading = false
  }

  async bind () {
    this.loading = true
    this.comments = await this.commentService.findAllForIssue(this.issueId)
    this.loading = false
  }
}
