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
  uniqueList: Array<any>;
  results: Array<any>;

  constructor(private calendarService: CalendarService) {
    this.intervals = [];
    this.results = [];
    this.uniqueList = [];
  }

  ngOnInit() {
    // service call to api
    this.calendarService.getAllClasses().subscribe(
      classes => {
        // calendar time init
        this.createIntervals();
        this.classes = classes;
        // get unique list of all class id's
        const seen = [];
        this.classes.forEach(course => {
          if (seen.indexOf(course.cid) === -1) {
            seen.push(course.cid);
            this.uniqueList.push(course);
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

  filterList(element) {
    if (element.value) {
      const expression = new RegExp('^' + element.value, 'i');
      this.results = this.uniqueList.filter(course => course.cid.match(expression) || course.name.match(expression));
    } else {
      this.results = [];
    }
  }
}
