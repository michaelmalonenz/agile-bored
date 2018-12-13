const assignees = []

export class AssigneeCache {
  static clearCache () {
    assignees.length = 0
  }

  static cacheUser (user) {
    const existing = assignees.find(u => u.id === user.id)
    if (user.id != null && existing == null) {
      assignees.push(user)
    }
  }

  static getCachedAssignees () {
    return assignees
  }
}
