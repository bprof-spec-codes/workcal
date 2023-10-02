import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  template: `
    <dx-scheduler
      [dataSource]="events"
      [currentDate]="currentDate"
      [startDayHour]="9"
      [endDayHour]="19"
      (onAppointmentFormOpening)="onAppointmentFormOpening($event)">
    </dx-scheduler>
  `,
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  events: any[] = [
    {
      text: "Test Event 1",
      startDate: new Date(2023, 9, 24, 10, 0),
      endDate: new Date(2023, 9, 24, 12, 0)
    },
    // ... more events
  ];
  currentDate: Date = new Date(2023, 9, 24);

  ngOnInit(): void {
    // Initialization logic here
  }

  onAppointmentFormOpening(data: any) {
    // Modify or handle the appointment form here
  }
}
