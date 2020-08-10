import {inject} from 'aurelia-framework'

import {AuthHttpClient} from './auth-http-client'
import {Comment} from '../models/comment'

@inject(AuthHttpClient)
export class CommentService {

  constructor (http) {
    this._http = http
  }

  async addComment (issueId, commentBody) {
    const res = await this._http
      .createRequest(`/api/issues/${issueId}/comment`)
      .asPost()
      .withContent({ body: commentBody })
      .withReviver(this._commentReviver)
      .send()

    return res.content
  }

  async findAllForIssue (issueId) {
    const res = await this._http
      .createRequest(`/api/issues/${issueId}/comments`)
      .asGet()
      .withReviver(this._commentReviver)
      .send()

      return res.content
  }

  _commentReviver (key, value) {
    if (key !== '' && value != null && typeof value === 'object' && !isNaN(key)) {
      return new Comment(value)
    }
    return value
  }
}
