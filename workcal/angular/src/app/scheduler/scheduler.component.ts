import { Component } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  template: `
    <dx-scheduler
      [dataSource]="events"
      [currentDate]="currentDate"
      [startDayHour]="9"
      [endDayHour]="19">
    </dx-scheduler>
  `,
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent  {
  events: any[] = [
    {
      text: "Event 1",
      startDate: new Date(2023, 4, 24, 10, 0),
      endDate: new Date(2023, 4, 24, 12, 0)
    },
    // ... more events
  ];
  currentDate: Date = new Date(2023, 4, 24);


}
