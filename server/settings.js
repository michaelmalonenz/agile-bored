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
    return init().then(() => {
      return _settingsInstance.useJira
    })
  },
  jiraUrl () {
    return init().then(() => {
      return _settingsInstance.jiraUrl
    })
  },
  jiraProjectName () {
    return init().then(() => {
      return _settingsInstance.jiraProjectName
    })
  },
  updateSettings (settings) {
    return init().then(() => {
      _settingsInstance = settings
    })
  }
}
