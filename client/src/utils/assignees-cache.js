const assignees = []

export class AssigneeCache {

  static clearCache () {
    assignees.length = 0
  }

  static cacheUser (user) {
    const existing = assignees.find(u => u.accountId === user.accountId)
    if (user.accountId != null && existing == null) {
      assignees.push(user)
    }
  }

  static getCachedAssignees () {
    return assignees
  }
}
