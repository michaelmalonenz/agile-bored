const ticksInADay = 24 * 60 * 60 * 1000
const inProgressStatuses = ['In Progress', 'Review', 'Test']
const resolvedStatuses = ['Done', 'Cancelled']

module.exports = {
  getGrowthRate (times) {
    const growthEpoch = new Date().valueOf() - (28 * ticksInADay)
    const growthTimes = times.filter(t => t.createdAt > growthEpoch || t.completedAt > growthEpoch)
    const complete = growthTimes.filter(t => t.completedAt != null && t.resolved).length
    const incomplete = growthTimes.length - complete
    return (incomplete || 1.0) / (complete || 1.0)
  },
  createTimeViewModel (events, statusName, createdAt) {
    return {
      duration: calculateTimeInProgress(events),
      done: statusName === 'Done',
      resolved: resolvedStatuses.includes(statusName),
      createdAt: createdAt,
      completedAt: calculateCompletedTime(events)
    }
  }
}

function calculateCompletedTime (changelogEvents) {
  const statusEvents = changelogEvents.filter(e => e.field === 'status')
  // reverse order
  statusEvents.sort((a, b) => b.timestamp - a.timestamp)
  for (let event of statusEvents) {
    if (resolvedStatuses.includes(event.toValue)) {
      return event.timestamp
    }
  }
  return null
}

function calculateTimeInProgress (changelogEvents) {
  const statusEvents = changelogEvents.filter(e => e.field === 'status')
  statusEvents.sort((a, b) => a.timestamp - b.timestamp)
  let duration = 0
  let lastTimestamp = null
  for (let event of statusEvents) {
    if (lastTimestamp != null) {
      duration += (event.timestamp - lastTimestamp)
    }
    if (inProgressStatuses.includes(event.toValue)) {
      lastTimestamp = event.timestamp
    } else {
      lastTimestamp = null
    }
  }
  return duration
}
