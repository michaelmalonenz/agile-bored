let statusCache = []

module.exports = {
  cacheStatuses (statuses) {
    statusCache = statuses
  },
  getCachedStatus (statusId) {
    return Promise.resolve(statusCache.find(s => s.id === statusId))
  }
}
