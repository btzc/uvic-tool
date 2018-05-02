import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Api } from './api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/observable/throw';

@Injectable()
export class CalendarService {
  classes: Array<any>;

  constructor(private api: Api) {
  }

  getAllClasses(): Observable<any> {
    this.classes = [];

   return this.api.getAllClasses()
    .map((res: Response) => res.json())
    .map((courses) => {
      if (!courses) {
        return Observable.throw(new Error('No Courses Found!'));
      }
      courses.data.forEach(course => {
        if (course.startTime && course.endTime) {
          this.classes.push(course);
        }
      });
    })
    .map(() => this.classes);
  }
}
