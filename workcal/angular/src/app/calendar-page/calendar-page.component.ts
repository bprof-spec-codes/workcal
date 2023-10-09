import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto  } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})


export class CalendarPageComponent implements OnInit {
  events: EventDto[] = [];
  schedulerEvents: any[] = []; // For DevExtreme Scheduler

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
    // This will refresh the page seamlessly
    this.router.navigate([this.router.url]);
  }



  fetchEvents(): void {
    this.eventApiService.getAllEvents().subscribe(data => {
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
      (response) => { //Assume backind id
        console.log('Event created successfully.');
        // Fetch updated events after creating
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
      console.log('Event updated successfully.');
      this.fetchEvents(); // Refresh
    },
    (error) => {
      console.error('Error updating event:', error);
    }

  );
  this.fetchEvents();

  }
  deleteEvent(eventId: string): void {
    this.eventApiService.deleteEvent(eventId).subscribe(() => {
      const index = this.events.findIndex(event => event.id === eventId);
      if (index !== -1) {
        this.events.splice(index, 1);

      }
    });
    this.fetchEvents();

  }

  onEventAdding(event): void {
    const appointmentData = event.appointmentData;

    // Prepare label data
    const selectedLabels = this.defaultLabels.filter(label =>
      appointmentData.labels?.includes(label.name)
    );





    const newEvent: EventDto = {
      id: '',
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: selectedLabels  //  label
    };

    console.log("Prepared payload for adding:", newEvent);
    this.createEvent(newEvent);
    this.fetchEvents();

  }


  onAppointmentDragStart(event): void {
    this.draggedEventLabels = event.itemData.labels;
    console.log("draggedEventLabels:", this.draggedEventLabels);

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

    // Initialize labels to empty arrays if they are null or undefined
    appointmentData.labels = appointmentData.labels || [];
    appointmentDataOld.labels = appointmentDataOld.labels || [];

    let selectedLabels = [];

    // Check if the labels field has been interacted with
    if (this.labelsInteractedWith) {
      // Trust the new labels from the form
      selectedLabels = this.defaultLabels.filter(label => appointmentData.labels.includes(label.name));
    } else {
      // Use the old labels
      selectedLabels = appointmentDataOld.labels;
    }

    const updatedEvent: EventDto = {
      id: appointmentDataOld.id,
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: selectedLabels  // Set selectedLabels, which may be empty
    };

    console.log("Prepared payload for updating:", updatedEvent);
    this.updateEvent(updatedEvent);
    this.labelsInteractedWith = false;
    this.fetchEvents();

  }



  onEventDeleting(event: any): void {
    const appointmentData = event.appointmentData;

    // Verify if the id is present
    if (!appointmentData.id) {
      console.error("Event ID is missing, cannot delete");
      event.cancel = true; //  if id is missing
      return;
    }

    console.log("Prepared id for deleting:", appointmentData.id);

    this.deleteEvent(appointmentData.id);
    this.fetchEvents();

  }

// Class-level variable to hold the flag
labelsInteractedWith: boolean = false;

  onAppointmentFormOpening(data: any): void {
    const form = data.form;

    // Fetch the old data (existing event data)
    const oldAppointmentData = data.appointmentData;
    if (oldAppointmentData.labels) {
      form.updateData('labels', oldAppointmentData.labels.map(l => l.name));
    }
    // Populate the 'labels' field in the form with old labels
    if (!oldAppointmentData.location) {
      form.updateData('location', '');  // Initialize with empty string or any default value
    }
    if (!oldAppointmentData.labels) {
      form.updateData('labels', []);  // Initialize with empty array
    }
    // Add new data fields for location and labels
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
