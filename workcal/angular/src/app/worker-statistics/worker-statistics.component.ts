import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserApiService } from '../user-api.service';


@Component({
  selector: 'app-worker-statistics',
  templateUrl: './worker-statistics.component.html',
  styleUrls: ['./worker-statistics.component.scss']
})
export class WorkerStatisticsComponent implements OnInit {
  workerHoursMonthly: Array<any> = [];
  workerHoursWeekly: Array<any> = [];
  reportType: string = 'weekly';
  selectedWorkerId: string | null = null;
  workers: UserDto[] = [];
  events: EventDto[] = [];

  constructor(private eventService: EventApiService,  private userApiService: UserApiService
  ) {}

  ngOnInit(): void {
    this.fetchEventsAndCalculateHours();
    this.fetchWorkers();
  }

  fetchWorkers(): void {
    this.userApiService.getAllUsers()
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      )
      .subscribe((data: UserResponse | any[]) => { // Explicitly type data
        if (Array.isArray(data)) {
          console.error('Received an array, expected an object with an items key:', data);
          return;
        }

        if (data && data.items) {
          this.workers = data.items.map(user => ({
            id: user.id,
            userName: user.userName,
            name: user.name,
            email: user.email
          }));
        } else {
          console.error('Items key not found in response:', data);
        }
        this.getWorkerStatistics(); // Call after workers are fetched

      });
  }




  onWorkerChange(): void {
    this.getWorkerStatistics();
  }


   fetchEventsAndCalculateHours(): void {
  this.eventService.getAllEvents().subscribe(events => {
    this.events = events;
      const userHoursMonthly = {};
      const userHoursWeekly = {};
      const now = new Date();

      events.forEach(event => {
        const eventDuration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60); // Convert to hours
        event.users.forEach(user => {
          // Calculate monthly hours if the event is in the current month
          if (new Date(event.startTime).getMonth() === now.getMonth()) {
            userHoursMonthly[user.id] = (userHoursMonthly[user.id] || 0) + eventDuration;
          }

          // Calculate weekly hours if the event is in the current week
          const eventWeek = this.getWeekNumber(new Date(event.startTime));
          const currentWeek = this.getWeekNumber(now);
          if (eventWeek === currentWeek) {
            userHoursWeekly[user.id] = (userHoursWeekly[user.id] || 0) + eventDuration;
          }
        });
      });

      // Convert the hours object to an array for the chart
      this.workerHoursMonthly = Object.keys(userHoursMonthly).map(userId => ({
        workerName: userId, // Replace with user name if available
        hours: userHoursMonthly[userId]
      }));

      this.workerHoursWeekly = Object.keys(userHoursWeekly).map(userId => ({
        workerName: userId, // Replace with user name if available
        hours: userHoursWeekly[userId]
      }));
    });
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getWorkerStatistics(): void {
    // Only run this if workers and events have been loaded
    if (this.workers && this.events) {
      console.log('Error fetching users:', this.selectedWorkerId);

      // If no worker is selected, clear the statistics
      if (!this.selectedWorkerId) {
        this.workerHoursMonthly = [];
        this.workerHoursWeekly = [];
        return;
      }
      console.log('Error fetching users:', this.selectedWorkerId);


      // Filter events for the selected worker
      const filteredEvents = this.events.filter(event =>
        event.users.some(user => user.id === this.selectedWorkerId));

      // Now calculate the statistics based on filteredEvents
      this.calculateStatistics(filteredEvents);
    }
  }


  // Extracted calculation logic into its own method
// Extracted calculation logic into its own method
calculateStatistics(events: EventDto[]): void {
  const userHoursMonthly = {};
  const userHoursWeekly = {};
  const now = new Date();

  events.forEach(event => {
    const eventDuration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60); // Convert to hours
    // Here, we know that only the selected worker's events are passed, so we just process the first user
    const user = event.users.find(user => user.id === this.selectedWorkerId);
    if (user) {
      // Calculate monthly hours if the event is in the current month
      if (new Date(event.startTime).getMonth() === now.getMonth()) {
        userHoursMonthly[user.id] = (userHoursMonthly[user.id] || 0) + eventDuration;
      }

      // Calculate weekly hours if the event is in the current week
      const eventWeek = this.getWeekNumber(new Date(event.startTime));
      const currentWeek = this.getWeekNumber(now);
      if (eventWeek === currentWeek) {
        userHoursWeekly[user.id] = (userHoursWeekly[user.id] || 0) + eventDuration;
      }
    }
  });

  // Since only one worker's statistics are needed, we don't need to map over keys, just create a single object
  this.workerHoursMonthly = [{
    workerName: this.workers.find(user => user.id === this.selectedWorkerId)?.id,
    hours: userHoursMonthly[this.selectedWorkerId] || 0
  }];

  this.workerHoursWeekly = [{
    workerName: this.workers.find(user => user.id === this.selectedWorkerId)?.id,
    hours: userHoursWeekly[this.selectedWorkerId] || 0
  }];
}

}
