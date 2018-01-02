import { inject } from 'aurelia-framework'
import { AuthHttpClient } from './auth-http-client'
import { HttpClient } from 'aurelia-http-client';

@inject(AuthHttpClient)
export class SearchService {
  constructor (http) {
    this._http = http
  }
}
