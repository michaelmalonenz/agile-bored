import { bindable, customElement, inject} from 'aurelia-framework'
import { EstimationService } from '../services/estimation'

@bindable('statuses')
@bindable('epic')
@customElement('epic')
@inject(EstimationService)
export class EpicViewModel {
  constructor (estimationService) {
    this.estimationService = estimationService
    this.estimate = null
  }

  async getEstimate() {
    let estimate = await this.estimationService.getEstimateForEpic(this.epic.id)
    this.estimate = estimate.estimate
  }
}
