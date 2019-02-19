import { inject, customElement, BindingEngine } from 'aurelia-framework'
import { ProjectService } from '../services/projects'
import { SettingsService } from '../services/settings'
import {SecuritySettings} from '../security/security-settings'

@inject(ProjectService, SettingsService, BindingEngine)
@customElement('project-panel')
export class ProjectPanel {
  constructor (projectService, settingsService, bindingEngine) {
    this.projectService = projectService
    this.settingsService = settingsService
    this.bindingEngine = bindingEngine
    this.project = null
    this.securitySettings = SecuritySettings.instance()
  }

  attached () {
    this.loggedInSubscription = this.bindingEngine
      .propertyObserver(this.securitySettings, 'loggedIn')
      .subscribe((newValue, oldValue) => {
        this.loggedInChanged(newValue, oldValue)
      })
  }
  
  detached () {
    this.loggedInSubscription.dispose()
  }

  async loggedInChanged (newValue, _oldValue) {
    if (newValue === true) {
      const settings = await this.settingsService.get()
      if (settings.useJira) {
        this.project = await this.projectService.getProject(settings.jiraProjectName)
      }
    } else {
      this.project = null
    }
  }
}
