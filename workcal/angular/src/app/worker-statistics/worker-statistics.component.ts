import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { UserApiService } from '../user-api.service';
import { fromEvent, of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-worker-statistics',
  templateUrl: './worker-statistics.component.html',
  styleUrls: ['./worker-statistics.component.scss']
})
export class WorkerStatisticsComponent implements OnInit {
  workerHoursMonthly: Array<any> = [];
  workerHoursWeekly: Array<any> = [];

  reportType: string = 'weekly';
  selectedWorkerIds: string[] = [];

  workers: UserDto[] = [];
  events: EventDto[] = [];

  startDate: Date;
  endDate: Date;

  distinctLabelNames: string[] = [];
  selectedLabelNames: string[] = [];


  constructor(private eventService: EventApiService,  private userApiService: UserApiService
  ) {}

  ngOnInit(): void {

    let now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);


    this.fetchEvents();
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
        this.getWorkerStatistics();

      });
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events;
      this.events = events;
      this.fetchDistinctLabelNames(events);
      this.getWorkerStatistics();
    });
  }


  fetchDistinctLabelNames(events: EventDto[]): void {
    const allLabelNames = events.flatMap(event => event.labels.map(label => label.name));
    this.distinctLabelNames = Array.from(new Set(allLabelNames));
  }

  onWorkerSelectionChange(workerId: string, isChecked: boolean): void {
    if (isChecked) {
      // Add workerId to the selectedWorkerIds if checked
      this.selectedWorkerIds.push(workerId);
    } else {
      // Remove workerId from the selectedWorkerIds if unchecked
      this.selectedWorkerIds = this.selectedWorkerIds.filter(id => id !== workerId);
    }
    // Update the statistics based on the new selection
    this.getWorkerStatistics();
  }



  onDateChange(): void {
    this.getWorkerStatistics();
  }


  onLabelSelectionChange(labelName: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedLabelNames.push(labelName);
    } else {
      this.selectedLabelNames = this.selectedLabelNames.filter(name => name !== labelName);
    }
    // Update the statistics based on the new label selection
    this.getWorkerStatistics();
  }


  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getWorkerStatistics(): void {
    // Ensure we have workers and events loaded
    if (this.workers.length && this.events.length) {
      // If no workers are selected, clear the statistics
      if (!this.selectedWorkerIds.length) {
        this.workerHoursMonthly = [];
        this.workerHoursWeekly = [];
        return;
      }
      // Filter events for the selected workers and date range
      const filteredEvents = this.events.filter(event =>
        event.users.some(user => this.selectedWorkerIds.includes(user.id)) &&
        new Date(event.startTime) >= this.startDate &&
        new Date(event.endTime) <= this.endDate
      );
      // Calculate the statistics based on filtered events
      this.calculateStatistics(filteredEvents);
    }
  }



calculateStatistics(events: EventDto[]): void {
  const userHoursMonthly = {};
  const userHoursWeekly = {};
  const now = new Date();

  // Filter events by selected labels if any labels are selected
  const filteredEventsByLabels = this.selectedLabelNames.length > 0
    ? events.filter(event =>
        event.labels.some(label => this.selectedLabelNames.includes(label.name))
      )
    : events;

  // Further filter events by date range if already not done
  const filteredEvents = filteredEventsByLabels.filter(event =>
    new Date(event.startTime) >= this.startDate &&
    new Date(event.endTime) <= this.endDate
  );

  // Process the filtered events
  filteredEvents.forEach(event => {
    const eventDuration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60); // Convert to hours

    event.users.forEach(user => {
      if (this.selectedWorkerIds.includes(user.id)) { // Assuming selectedWorkerIds is an array now
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
  });

  // Convert the user hours object to an array for the chart, filtering by selected workers
  this.workerHoursMonthly = Object.keys(userHoursMonthly)
    .filter(userId => this.selectedWorkerIds.includes(userId))
    .map(userId => ({
      workerName: this.workers.find(user => user.id === userId)?.name, // Assuming you want to display the user's name
      hours: userHoursMonthly[userId]
    }));

  this.workerHoursWeekly = Object.keys(userHoursWeekly)
    .filter(userId => this.selectedWorkerIds.includes(userId))
    .map(userId => ({
      workerName: this.workers.find(user => user.id === userId)?.name, // Assuming you want to display the user's name
      hours: userHoursWeekly[userId]
    }));
}



}
