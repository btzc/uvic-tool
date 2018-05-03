import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  classes: Array<any>;
  intervals: Array<any>;
  uniqueClassList: Array<any>;
  uniqueClassIdList: Array<any>;
  uniqueClassName: Array<any>;
  results: Array<any>;
  schedule: Array<any>;
  input: any;

  constructor(private calendarService: CalendarService) {
    this.intervals = [];
    this.results = [];
    this.uniqueClassList = [];
    this.uniqueClassIdList = [];
    this.uniqueClassName = [];
    this.schedule = [];
  }

  ngOnInit() {
    this.input = {
      query: ''
    };
    // service call to api
    this.calendarService.getAllClasses().subscribe(
      classes => {
        // calendar time init
        this.createIntervals();
        this.classes = classes;
        // get unique list of all classes
        this.classes.forEach(course => {
          if (this.uniqueClassIdList.indexOf(course.cid.toLowerCase()) === -1) {
            this.uniqueClassName.push(course.name.toLowerCase());
            this.uniqueClassIdList.push(course.cid.toLowerCase());
            this.uniqueClassList.push(course);
          }
        });
      }
    );
  }

  // set calendar time steps
  createIntervals() {
    const startTime = 8;
    const endTime = 23;

    for (let i = startTime; i < endTime; i++) {
      if (i % 12 === 0) {
        this.intervals.push(`${i}:00`);
        this.intervals.push(`${i}:30`);
      } else {
        this.intervals.push(`${i % 12}:00`);
        this.intervals.push(`${i % 12}:30`);
      }
    }
  }

  // filter this.uniqueList given input value and display filtered list
  filterList(element) {
    if (element.value) {
      const cidExpression = new RegExp('^' + element.value, 'i');
      const nameExpression = new RegExp(element.value, 'i');
      this.results = this.uniqueClassList.filter(course => course.cid.match(cidExpression) || course.name.match(nameExpression));
    } else {
      this.results = [];
    }
  }

  // append course to calendar
  addClass(value) {
    if (this.uniqueClassIdList.indexOf(value.query.toLowerCase()) === -1 &&
        this.uniqueClassName.indexOf(value.query.toLowerCase()) === -1) {

      throw new Error('Class Does Not Exist!!');
    }
    const sections = [];
    this.classes.forEach(course => {
      if (course.cid.toLowerCase() === value.query.toLowerCase() || course.name.toLowerCase() === value.query.toLowerCase()) {
        sections.push(course);
      }
    });
    this.schedule.push(sections);
  }
}
