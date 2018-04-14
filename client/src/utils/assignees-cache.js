const assignees = []

export class AssigneeCache {

  static clearCache () {
    assignees.length = 0
  }

  static cacheUser (user) {
    assignees.push(user)
  }

  static getCachedAssignees () {
    return assignees
  }

  // need to filter for only unique users.
  // this.users = users.filter((value, index, self) => {
  //   return (self.findIndex(x => x.accountId === value.accountId) === index &&
  //     (Object.keys(value).length !== 0 || value.constructor !== Object))
  // })
}
