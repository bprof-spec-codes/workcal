import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto } from '../models/event-dto.model'; // Create this model

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
      location: ''//appointmentData.location // Replace with the correct field name if it's different
    };

    console.log("Prepared payload for adding:", newEvent);  // Debug line to check prepared payload
    this.createEvent(newEvent);
  }



  onEventUpdating(event): void {
    const updatedEvent: EventDto = {
      id: event.id,
      name: event.text,
      startTime: event.startDate,
      endTime: event.endDate,
      location: event.location
    };
    console.log('Updating event:', updatedEvent);  // Debug line
    this.updateEvent(updatedEvent);
  }

  onEventDeleting(event): void {
    console.log('Deleting event with ID:', event.id);  // Debug line
    this.deleteEvent(event.id);
  }


  // Implement similar methods for creating, updating, and deleting events.
}
