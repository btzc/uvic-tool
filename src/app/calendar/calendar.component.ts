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

  constructor(private calendarService: CalendarService) {
    this.intervals = [];
  }

  ngOnInit() {
    this.calendarService.getAllClasses().subscribe(
      classes => {
        this.createIntervals();
        this.classes = classes;
        console.log(this.classes);
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
}
