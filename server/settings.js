const db = require('./models')

let _settingsInstance = null

function init () {
  if (_settingsInstance) {
    return Promise.resolve()
  } else {
    return db.Settings.findOne().then(settings => {
      _settingsInstance = settings
    })
  }
}

module.exports = {
  useJira () {
    return init().then(() => _settingsInstance.useJira)
  },
  jiraUrl () {
    return init().then(() => _settingsInstance.jiraUrl)
  },
  jiraProjectName () {
    return init().then(() => _settingsInstance.jiraProjectName)
  },
  jiraRapidBoardId () {
    return init().then(() => _settingsInstance.jiraRapidBoardId)
  },
  groupByEpic () {
    return init().then(() => _settingsInstance.groupByEpic)
  },
  getSettings () {
    return init().then(() => _settingsInstance)
  },
  jiraEpicField () {
    return init().then(() => _settingsInstance.jiraEpicField)
  },
  updateSettings (settings) {
    _settingsInstance = settings
  }
}
