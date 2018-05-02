import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class Api {
  apiPath: string;

  constructor(private http: Http) {
    const hostname = this.setHost(window.location.hostname);
    this.apiPath = this.getHostName(hostname);
    console.log(this.apiPath);
  }

  setHost(hostname) {
    if ( hostname === 'localhost') {
      return 'http://localhost:3000';
    } else {
      return hostname;
    }
  }

  getHostName(hostname) {
    return `${ hostname }/api`;
  }

  getAllClasses() {
    return this.get(`/all`);
  }

  get(apiRoute: string, options?: Object) {
    return this.http.get(`${this.apiPath}/${apiRoute}`, options || null);
  }
}
