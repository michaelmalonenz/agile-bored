import {inject} from 'aurelia-framework'
import {HttpClient} from 'aurelia-http-client'

@inject(HttpClient)
export class StatusService {

  constructor(http) {
    this._http = http
  }

  findAllForProject (projectId) {
    
  }
}