import { customElement, bindable, inject } from 'aurelia-framework'

import { CommentService } from '../services/comments'

@bindable('comments')
@bindable('issueId')
@customElement('comments-list')
@inject(CommentService)
export class CommentsList {
  constructor (commentService) {
    this.commentService = commentService
    this.loading = false
    this.newComment = ''
    this.addingComment = false
  }

  async bind () {
    if (this.issueId) {
      console.log(this.issueId)
      this.loading = true
      this.comments = await this.commentService.findAllForIssue(this.issueId)
      this.loading = false
    }
  }

  async addComment () {
    this.addingComment = true
    const created = await this.commentService.addComment(this.issueId, this.newComment)
    this.comments.push(created)
    this.newComment = ''
    this.addingComment = false
  }
}
