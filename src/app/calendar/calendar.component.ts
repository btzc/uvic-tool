import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
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
        this.intervals.push(`${i}:00 pm`);
        this.intervals.push(`${i}:30 pm`);
      } else {
        if (i < 12) {
          this.intervals.push(`${i % 12}:00 am`);
          this.intervals.push(`${i % 12}:30 am`);
        } else {
          this.intervals.push(`${i % 12}:00 pm`);
          this.intervals.push(`${i % 12}:30 pm`);
        }
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

  // append course to your course list
  addClass(value) {
    if (this.uniqueClassIdList.indexOf(value.query.toLowerCase()) === -1 &&
        this.uniqueClassName.indexOf(value.query.toLowerCase()) === -1) {

      throw new Error('Class Does Not Exist!!');
    }

    document.querySelector('input').value = '';
    this.results = [];

    this.schedule.forEach(course => {
      if (course[0].cid.toLowerCase() === value.query.toLowerCase() || course[0].name.toLowerCase() === value.query.toLowerCase()) {
        throw new Error('Class Already Added!');
      }
    });

    const sections = [];
    this.classes.forEach(course => {
      if (course.cid.toLowerCase() === value.query.toLowerCase() || course.name.toLowerCase() === value.query.toLowerCase()) {
        sections.push(course);
      }
    });
    this.addToCalendar(sections);
    this.schedule.push(sections);
  }

  // append chosen course to calendar
  addToCalendar(sections) {
    const rows = Array.from(document.querySelector('#table').querySelectorAll('tr'));
    sections.forEach(section => {
      if (section.sectionNum === 'A01' || section.sectionNum === 'B01' || section.sectionNum === 'T01') {
        const startTime = this.calculateStartTime(section.startTime);
        const endTime = this.calculateStartTime(section.endTime);
        rows.forEach(row => {
          const rowTime = this.calculateStartTime(row.cells[0].innerHTML);
          if (JSON.stringify(startTime) === JSON.stringify(rowTime)) {
            section.dates.forEach(day => {
              const time1 = new Date(null, null, null, startTime[0], startTime[1]);
              const time2 = new Date(null, null, null, endTime[0], endTime[1]);
              const minutes = (time2.getTime() - time1.getTime()) / 60000;
              const height = (minutes / 30) * 100;
              const div = document.createElement('div');
              div.innerHTML = `
                ${section.name}
                ${section.cid} ${section.sectionNum}
                ${section.startTime}-${section.endTime}
              `;
              div.classList.add('filled');
              div.style.height = height + '%';
              div.style.zIndex = '100';

              if (day === 'M') {
                row.cells[1].appendChild(div);
              } else if (day === 'T') {
                row.cells[2].appendChild(div);
              } else if (day === 'W') {
                row.cells[3].appendChild(div);
              } else if (day === 'R') {
                row.cells[4].appendChild(div);
              } else if (day === 'F') {
                row.cells[5].appendChild(div);
              } else {
                throw new Error('Problem finding date!');
              }
            });
          }
        });
      }
    });
  }

  calculateStartTime(time) {
    const timeParts = time.replace(/^\s+|\s+$/g, '').split(' ');
    const timeDivision = timeParts[0].split(':');
    const hour = timeDivision[0];

    if (timeParts[1] === 'pm' && timeDivision[0] !== '12') {
      timeDivision[0] = (parseInt(hour, 10) + 12).toString();
    }

    timeDivision.push(timeParts[1]);

    return timeDivision;
  }
}
