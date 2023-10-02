import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto } from '../models/event-dto.model';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {
  events: EventDto[] = [];
  schedulerEvents: any[] = []; // For DevExtreme Scheduler

  currentDate: Date = new Date();
  currentView: string = 'day';

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
        location: event.location
      }));
    });
  }


  createEvent(newEvent: EventDto): void {
    this.eventApiService.createEvent(newEvent).subscribe(data => {
      this.events.push(data);
      // Optionally, refresh the Scheduler to show the new event
    });
  }
  updateEvent(eventToUpdate: EventDto): void {
    this.eventApiService.updateEvent(eventToUpdate.id, eventToUpdate).subscribe(() => {
      const index = this.events.findIndex(event => event.id === eventToUpdate.id);
      if (index !== -1) {
        this.events[index] = eventToUpdate;
        // Optionally, refresh the Scheduler to reflect the update
      }
    });
  }
  deleteEvent(eventId: string): void {
    this.eventApiService.deleteEvent(eventId).subscribe(() => {
      const index = this.events.findIndex(event => event.id === eventId);
      if (index !== -1) {
        this.events.splice(index, 1);
        // Optionally, refresh the Scheduler to reflect the deletion
      }
    });
  }

  onEventAdding(event): void {
    // Access the correct appointmentData object
    const appointmentData = event.appointmentData;

    const newEvent: EventDto = {
      id: '',  // Replace with a proper UUID or let your backend handle it
      name: appointmentData.text, // Replace with the correct field name if it's different
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || ''
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
      location: appointmentData.location || ''
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

    // Add a new data field for location
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
        }
      ]
    });
  }


}
