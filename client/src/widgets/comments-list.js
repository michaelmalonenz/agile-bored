import { customElement, bindable, inject } from 'aurelia-framework'

import { CommentService } from '../services/comments'

@bindable('issueId')
@bindable('comments')
@customElement('comments-list')
@inject(CommentService)
export class CommentsList {
  constructor (commentService) {
    this.commentService = commentService
    this.loading = false
    this.newComment = ''
    this.addingComment = false
    this.comments = []
  }

  async bind () {
    if (this.issueId) {
      this.loading = !this.comments
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
