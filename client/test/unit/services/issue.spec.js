/* global describe, it, expect, beforeEach, spyOn */
import { IssueService } from '../../../src/services/issues'
import { Issue } from '../../../src/models/issue'

describe('The User Service', function () {
  beforeEach(function () {
    this.http = { put () {} }
    spyOn(this.http, 'put').and.returnValue(Promise.resolve({ content: {} }))
    this.subject = new IssueService(this.http)
  })

  it('PUT a non-cyclical structure to the http client', function () {
    const issue = new Issue()
    issue.id = 1234
    issue.children.push(new Issue())
    return this.subject.update(issue).then(() => {
      expect(this.http.put).toHaveBeenCalledWith('/api/issue/1234', issue)
    })
  })
})
