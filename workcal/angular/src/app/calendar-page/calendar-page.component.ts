import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto  } from '../models/event-dto.model';

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
// Define some example labels with names and colors
defaultLabels: Array<{ name: string, color: string }> = [
  { name: 'Meeting', color: '#FF0000' },
  { name: 'Workshop', color: '#00FF00' },
  { name: 'Conference', color: '#0000FF' },
  { name: 'Webinar', color: '#FFFF00' }
];

  constructor(private eventApiService: EventApiService) { }

  ngOnInit(): void {
    this.fetchEvents();

  }




  fetchEvents(): void {
    this.eventApiService.getAllEvents().subscribe(data => {
      this.events = data;
      this.schedulerEvents = data.map(event => ({
        id:event.id,
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
      () => {
        console.log('Event created successfully.');
        this.fetchEvents(); // Refresh events after creating
      },
      (error) => {
        console.error('Error creating event:', error);
      }
    );
  }
  updateEvent(eventToUpdate: EventDto): void {
    this.eventApiService.updateEvent(eventToUpdate.id, eventToUpdate).subscribe( () => {
      console.log('Event updated successfully.');
      this.fetchEvents(); // Refresh events after updating
    },
    (error) => {
      console.error('Error updating event:', error);
    }
  );
  }
  deleteEvent(eventId: string): void {
    this.eventApiService.deleteEvent(eventId).subscribe(() => {
      const index = this.events.findIndex(event => event.id === eventId);
      if (index !== -1) {
        this.events.splice(index, 1);

      }
    });
  }

  onEventAdding(event): void {
    // Access the correct appointmentData object
    const appointmentData = event.appointmentData;

    const newEvent: EventDto = {
      id: '',
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: appointmentData.labels || []
    };

    console.log("Prepared payload for adding:", newEvent);  // Debug line to check prepared payload
    this.createEvent(newEvent);
  }



  onEventUpdating(event): void {
    console.log("Event update object:", event); // Debug line
    const appointmentData = event.newData;
    const appointmentDataold = event.oldData;

    if (!appointmentDataold.id) {
      console.error("Event ID is missing, cannot update");
      return;
    }

    const updatedEvent: EventDto = {
      id: appointmentDataold.id,
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: appointmentData.labels || []
    };

    console.log("Prepared payload for updating:", updatedEvent);  // Debug line to check prepared payload

    // Assuming updateEvent() sends the updated event to the backend
    this.updateEvent(updatedEvent);
  }

  onEventDeleting(event: any): void {
    const appointmentData = event.appointmentData;

    // Verify if the id is present
    if (!appointmentData.id) {
      console.error("Event ID is missing, cannot delete");
      event.cancel = true; // Prevents the deletion if id is missing
      return;
    }

    console.log("Prepared id for deleting:", appointmentData.id);  // Debug line to check prepared id

    // Assuming deleteEvent() sends a request to delete the event by id
    this.deleteEvent(appointmentData.id);
  }


  onAppointmentFormOpening(data: any): void {
    const form = data.form;

    // Debugging: Check if labels data is available
    console.log('Selected Event Labels:', this.selectedEvent?.labels);  // Debug line

    // Safely check if labels exist before mapping
    const labelNames = this.selectedEvent?.labels?.map(l => l.name) || [];

    // Add a new data field for location and labels
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
  }



}
