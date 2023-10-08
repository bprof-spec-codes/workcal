/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { EventDto } from '../models/event-dto.model';

@Component({
  selector: 'app-scheduler',
  template: `

  `,
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  schedulerEvents: any[];
  selectedEvent: EventDto;

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

  }

  onAppointmentFormOpening(data: any): void {
    const form = data.form;


    form.itemOption('mainGroup', {
      items: [
        ...form.itemOption('mainGroup').items,
        {
          dataField: 'labels',
          editorType: 'dxTagBox',
          editorOptions: {
            items: this.selectedEvent.labels.map(l => l.name),
            placeholder: 'Add labels...'
          },
          label: {
            text: 'Labels'
          }
        }
      ]
    });
  }
}
