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


  // Implement similar methods for creating, updating, and deleting events.
}
