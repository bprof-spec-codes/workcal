import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, SchedulerEvent  } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})


export class CalendarPageComponent implements OnInit {
  events: EventDto[] = [];
  schedulerEvents: SchedulerEvent[] = [];

  selectedEvent: EventDto;

  currentDate: Date = new Date();
  currentView: string = 'day';
   draggedEventLabels;



defaultLabels: Array<{ name: string, color: string }> = [
  { name: 'Meeting', color: '#FF0000' },
  { name: 'Workshop', color: '#00FF00'},
  { name: 'Conference', color: '#0000FF' },
  { name: 'Webinar', color: '#FFFF00'}
];
IdLabels: Array<{ name: string, color: string,eventId: string }> = [
  { name: 'Meeting', color: '#FF0000' ,eventId:'' },
  { name: 'Workshop', color: '#00FF00',eventId:'' },
  { name: 'Conference', color: '#0000FF',eventId:'' },
  { name: 'Webinar', color: '#FFFF00',eventId:'' }
];


  constructor(private eventApiService: EventApiService,private router: Router)
  {   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';}

  ngOnInit(): void {
    this.fetchEvents();

  }

  refreshPage() {
    this.router.navigate([this.router.url]);
  }



  fetchEvents(): void {
    this.eventApiService.getAllEvents()
      .pipe(
        catchError(error => {
          console.error('Error fetching events:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.events = data;
        this.schedulerEvents = data.map(event => ({
          id: event.id,
          startDate: event.startTime,
          endDate: event.endTime,
          text: event.name,
          location: event.location,
          labels: event.labels
        }));
      });
  }




  createEvent(newEvent: EventDto): void {
    this.eventApiService.createEvent(newEvent).subscribe(
      (response) => {
        this.fetchEvents();
      },
      (error) => {
        console.error('Error creating event:', error);
      }
    );
    this.refreshPage();

  }


  updateEvent(eventToUpdate: EventDto): void {
    this.eventApiService.updateEvent(eventToUpdate.id, eventToUpdate).subscribe( () => {
      this.fetchEvents();
    },
    (error) => {
      console.error('Error updating event:', error);
    }

  );
  this.fetchEvents();
  this.refreshPage();

  }

  deleteEvent(eventId: string): void {
    const index = this.events.findIndex(event => event.id === eventId);
    if (index !== -1) {
      this.eventApiService.deleteEvent(eventId).subscribe(() => {
        this.events.splice(index, 1);
        this.fetchEvents();
      });
    }
    this.refreshPage();

  }

  onEventAdding(event): void {
    const appointmentData = event.appointmentData;

    const selectedLabels = this.defaultLabels.filter(label =>
      appointmentData.labels?.includes(label.name)
    );





    const newEvent: EventDto = {

      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: selectedLabels
    };

    this.createEvent(newEvent);
    this.fetchEvents();
    this.refreshPage();

  }


  onAppointmentDragStart(event): void {
    this.draggedEventLabels = event.itemData.labels;

  }

  onAppointmentDragEnd(event): void {
    if (event.fromComponent === event.toComponent) {
      const appointmentData = event.itemData;
      appointmentData.labels = this.draggedEventLabels;
      this.updateEvent(appointmentData);
    }
    this.fetchEvents();

  }

  onEventUpdating(event): void {
    const appointmentData = event.newData;
    const appointmentDataOld = event.oldData;

    if (!appointmentDataOld.id) {
      console.error("Event ID is missing, cannot update");
      return;
    }

    appointmentData.labels = appointmentData.labels || [];
    appointmentDataOld.labels = appointmentDataOld.labels || [];

    let selectedLabels = [];

    if (this.labelsInteractedWith) {
      selectedLabels = this.defaultLabels.filter(label => appointmentData.labels.includes(label.name));
    } else {
      selectedLabels = appointmentDataOld.labels;
    }

    const updatedEvent: EventDto = {
      id: appointmentDataOld.id,
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: selectedLabels
    };

    this.updateEvent(updatedEvent);
    this.labelsInteractedWith = false;
    this.fetchEvents();
    this.refreshPage();

  }



  onEventDeleting(event: {
    cancel: boolean; appointmentData: SchedulerEvent
}): void {
    const appointmentData = event.appointmentData;

    if (!appointmentData.id) {
      console.error("Event ID is missing, cannot delete");
      event.cancel = true;
      return;
    }


    this.deleteEvent(appointmentData.id);
    this.fetchEvents();

  }

labelsInteractedWith: boolean = false;

onAppointmentFormOpening(data: { form: any, appointmentData: SchedulerEvent }): void {
  const form = data.form;

    const oldAppointmentData = data.appointmentData;
    if (oldAppointmentData.labels) {
      form.updateData('labels', oldAppointmentData.labels.map(l => l.name));
    }
    if (!oldAppointmentData.location) {
      form.updateData('location', '');
    }
    if (!oldAppointmentData.labels) {
      form.updateData('labels', []);
    }
    form.itemOption('mainGroup', {


      items: [
        ...form.itemOption('mainGroup').items,
        {
          dataField: 'location',
          editorType: 'dxTextBox',
          editorOptions: {
            placeholder: 'Enter location...'
          },
          label: {
            text: 'Location'
          }
        },
        {
          dataField: 'labels',
          editorType: 'dxTagBox',
          editorOptions: {
            dataSource: this.defaultLabels,
            displayExpr: 'name',
            valueExpr: 'name',
            itemTemplate: function(itemData, _, itemElement) {
              itemElement.textContent = itemData.name;
              itemElement.style.backgroundColor = itemData.color;
            },
            placeholder: 'Add labels...'
          },
          label: {
            text: 'Labels'
          }
        }
      ]
    });

    form.getEditor('labels').option('onValueChanged', () => {
      this.labelsInteractedWith = true;
    });
    this.fetchEvents();

  }




}
