const ticksInADay = 24 * 60 * 60 * 1000
const inProgressStatuses = ['In Progress', 'Review', 'Test']
const resolvedStatuses = ['Done', 'Cancelled']

function getGrowthRate (times) {
  const growthEpoch = new Date().valueOf() - (28 * ticksInADay)
  const growthTimes = times.filter(t => t.createdAt > growthEpoch || t.completedAt > growthEpoch)
  const complete = growthTimes.filter(t => t.completedAt != null && t.resolved).length
  const incomplete = growthTimes.length - complete
  return (incomplete || 1.0) / (complete || 1.0)
}

module.exports = {
  getGrowthRate,
  createTimeViewModel (events, statusName, createdAt) {
    return {
      duration: calculateTimeInProgress(events),
      done: statusName === 'Done',
      resolved: resolvedStatuses.includes(statusName),
      createdAt: createdAt,
      completedAt: calculateCompletedTime(events),
      intoProgressTime: calculateIntoProgressTime(events)
    }
  },
  getEstimatedDaysRemaining (times) {
    const averageDaysPerIssue = Math.ceil(getEstimatedIssueDuration(times) / ticksInADay)
    const incomplete = times.filter(t => !t.resolved)
    return averageDaysPerIssue * incomplete.length
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

function getEstimatedIssueDuration (times) {
  const inProgressTimes = times.filter(t => t.duration !== 0)
  if (inProgressTimes.length === 0) {
    return Infinity
  }
  const min = getMinimumDuration(inProgressTimes)
  const max = getMaximumDuration(inProgressTimes)
  const total = inProgressTimes.reduce((prev, current) => prev + current.duration, 0)
  const average = total / inProgressTimes.length
  const growthRate = getGrowthRate(times)
  return ((min + (4 * average) + max) / 6) * growthRate
}

function getMinimumDuration (times) {
  const completedIssues = times.filter(t => t.done)
  if (completedIssues.length) {
    return Math.min(...(completedIssues.map(t => t.duration)))
  }
  if (times.length) {
    return Math.min(...(times.map(t => t.duration)))
  }
  return 0
}

function getMaximumDuration (times) {
  const completedIssues = times.filter(t => t.done)
  if (completedIssues.length) {
    return Math.max(...(completedIssues.map(t => t.duration)))
  }
  if (times.length) {
    return Math.max(...(times.map(t => t.duration)))
  }
  return Infinity
}

function calculateIntoProgressTime (changelogEvents) {
  const statusEvents = changelogEvents.filter(e => e.field === 'status')
  statusEvents.sort((a, b) => a.timestamp - b.timestamp)
  if (statusEvents.length) {
    return statusEvents.find(e => inProgressStatuses.includes(e.toValue)).timestamp
  }
  return null
}
