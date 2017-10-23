const db = require('./models')

let _settingsInstance = db.Settings.findOne()

module.exports = {
  useJira () {
    return _settingsInstance.useJira
  },
  jiraUrl () {
    return _settingsInstance.jiraUrl
  },
  updateSettings (settings) {
    _settingsInstance = settings
  }
}
