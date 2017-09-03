/* global localStorage */

const SettingsContainer = {
  version: 1,
  content: '{ "jiraUrl": "", "jiraUsername": "" }'
}

const SETTINGS_KEY = 'settings'

export class SettingsService {

  get () {
    const settingsObject = localStorage.getItem(SETTINGS_KEY)
    if (settingsObject) {
      let settingsCont = JSON.parse(settingsObject)
      if (settingsCont.version === 1) {
        return JSON.parse(settingsCont.content)
      }
    }
    return JSON.parse(SettingsContainer.content)
  }

  update (settings) {
    const settingsCont = Object.assign({}, SettingsContainer)
    settingsCont.content = JSON.stringify(settings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsCont))
  }
}
