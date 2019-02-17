import { inject, customElement } from 'aurelia-framework'
import { ProjectService } from '../services/projects'

@inject(ProjectService)
@customElement('project-panel')
export class ProjectPanel {
  constructor (projectService) {
    this.projectService = projectService
  }
}
