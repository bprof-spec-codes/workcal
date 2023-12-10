/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { EventDto, SchedulerEvent } from '../models/event-dto.model';

@Component({
  selector: 'app-scheduler',
  template: `

  `,
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  schedulerEvents: SchedulerEvent[] = [];
  selectedEvent: EventDto;

  events: EventDto[] = [

  ];

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
