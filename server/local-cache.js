let statusCache = []

module.exports = {
  cacheStatuses (statuses) {
    statusCache = statuses
  },
  getCachedStatuses () {
    return statusCache
  }
}
