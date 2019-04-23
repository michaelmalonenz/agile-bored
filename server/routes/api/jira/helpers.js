const ticksInADay = 24 * 60 * 60 * 1000
const inProgressStatuses = ['In Progress', 'In Review', 'Test']
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
    const statusEvents = events.filter(e => e.field === 'status')
    return {
      duration: calculateTimeInProgress(statusEvents),
      done: statusName === 'Done',
      resolved: resolvedStatuses.includes(statusName),
      createdAt: createdAt,
      completedAt: calculateCompletedTime(statusEvents),
      intoProgressTime: calculateIntoProgressTime(statusEvents),
      commitTime: calculateCommitTime(statusEvents)
    }
  },
  getEstimatedDaysRemaining (times) {
    const averageDaysPerIssue = Math.ceil(getEstimatedIssueDuration(times) / ticksInADay)
    const incomplete = times.filter(t => !t.resolved)
    return averageDaysPerIssue * incomplete.length
  },
  getTimeString (days) {
    let result = ''
    let weeks = 0
    let years = 0
    if (days > 7) {
      weeks = Math.floor(days / 7)
      days = days % 7
    }
    if (weeks > 52) {
      years = Math.floor(weeks / 52)
      weeks = weeks % 52
    }
    if (years > 0) {
      result += `${years} year${years === 1 ? '' : 's'} `
    }
    if (weeks > 0) {
      result += `${weeks} week${weeks === 1 ? '' : 's'} `
    }
    if (days > 0) {
      result += `${days} day${days === 1 ? '' : 's'}`
    }
    return result
  }
}

function calculateCompletedTime (statusEvents) {
  // reverse order
  statusEvents.sort((a, b) => b.timestamp - a.timestamp)
  for (let event of statusEvents) {
    if (resolvedStatuses.includes(event.toValue)) {
      return event.timestamp
    }
  }
  return null
}

function calculateTimeInProgress (statusEvents) {
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

function calculateIntoProgressTime (statusEvents) {
  statusEvents.sort((a, b) => a.timestamp - b.timestamp)
  if (statusEvents.length) {
    const inProgressEvent = statusEvents.find(e => inProgressStatuses.includes(e.toValue))
    if (inProgressEvent) {
      return inProgressEvent.timestamp
    }
  }
  return null
}

function calculateCommitTime (statusEvents) {
  statusEvents.sort((a, b) => a.timestamp - b.timestamp)
  if (statusEvents.length) {
    const inReviewEvent = statusEvents.find(e => e.toValue === 'In Review')
    if (inReviewEvent) {
      return inReviewEvent.timestamp
    }
  }
  return null
}
