import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { UserApiService } from '../user-api.service';
import { fromEvent, of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';
import { AuthService } from '@abp/ng.core';
import { UserService} from '../services/user.service';

@Component({
  selector: 'app-worker-statistics',
  templateUrl: './worker-statistics.component.html',
  styleUrls: ['./worker-statistics.component.scss']
})
export class WorkerStatisticsComponent implements OnInit {
  workerHours: Array<any> = [];

  reportTypeList: string[] = ['daily', 'weekly', 'monthly', 'yearly'];

  reportType: string = 'weekly';
  selectedWorkerIds: string[] = [];
  selectedWorkers: UserDto[] = [];

  workerHoursSum: number;

  workers: UserDto[] = [];
  events: EventDto[] = [];

  startDate: Date;
  endDate: Date;

  distinctLabelNames: string[] = [];
  selectedLabelNames: string[] = [];

  filteredEvents: EventDto[] = [];

  userRole: string;
  currentUserId: string;
  isWorker: boolean;

  constructor(private authService: AuthService, private userService: UserService,private eventService: EventApiService,  private userApiService: UserApiService
  ) {}

  ngOnInit(): void {

    let now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    //this.getUserRole();

   // this.fetchEvents();
    this.getCurrentUser();

  }

  getCurrentUser(): void {
    this.userService.getUserId().subscribe(
      response => {
        console.log('API Response:', response);
        this.currentUserId = response.id;

        // Now that you have the current user ID, fetch the user role
        this.getUserRole();
      },
      error => {
        console.error('Error fetching user ID', error);
      }
    );
  }

  getUserRole(): void {
    console.log('Fetching user role...');
    this.userService.getUserRole().subscribe(
      response => {
        console.log('API Response:', response);
        this.userRole = response.role;
        console.log(' this.currentUserId:', this.currentUserId);

        if (this.userRole === 'worker') {
          this.isWorker = true;
          this.selectedWorkerIds = [this.currentUserId];
        } else {
          this.isWorker = false;
        }

        // Fetch workers and events after getting the role
        this.fetchWorkers();
        this.fetchEvents();
      },
      error => {
        console.error('Error fetching user role', error);
      }
    );
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
          if (this.isWorker) {
            this.workers = this.workers.filter(worker => worker.id === this.currentUserId);
          }

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
    this.selectedWorkers = this.workers.filter(worker => this.selectedWorkerIds.includes(worker.id));

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

  onReportTypeChange(): void {
    // Assuming the events are already filtered by worker and date
    this.calculateStatistics(this.filteredEvents);
  }

  groupEventsByReportType(events: EventDto[], reportType: string): { [key: string]: EventDto[] } {
    const groupedEvents = {};

    for (const event of events) {
      let key;
      const eventDate = new Date(event.startTime);

      switch (reportType) {
        case 'daily':
          key = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          key = `Week ${this.getWeekNumber(eventDate)}`;
          break;
        case 'monthly':
          key = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}`;
          break;
        case 'yearly':
          key = eventDate.getFullYear().toString();
          break;
      }

      if (!groupedEvents[key]) {
        groupedEvents[key] = [];
      }
      groupedEvents[key].push(event);
    }

    return groupedEvents;
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
        this.workerHours = [];

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
    // Filter events by selected labels if any labels are selected
    const filteredEventsByLabels = this.selectedLabelNames.length > 0
      ? events.filter(event =>
          event.labels.some(label => this.selectedLabelNames.includes(label.name))
        )
      : events;

    // Segment the filtered events by the reportType
    const segmentedEvents = this.groupEventsByReportType(filteredEventsByLabels, this.reportType);

    // Initialize variables to hold the segmented data
    let segmentedData = {};

    // Iterate over each segment to calculate the total hours
    for (const [segment, segmentEvents] of Object.entries(segmentedEvents)) {
      segmentedData[segment] = segmentEvents.reduce((acc, event) => {
        const eventDuration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60); // Convert to hours
        event.users.forEach(user => {
          if (this.selectedWorkerIds.includes(user.id)) {
            acc[user.id] = (acc[user.id] || 0) + eventDuration;
          }
        });
        return acc;
      }, {});
    }

    // Prepare data for the chart
    this.workerHours = [];

    // Create a map to track the index for each worker
    let workerIndexMap = {};
    this.selectedWorkerIds.forEach((id, index) => {
      workerIndexMap[id] = index;
    });

    // Populate the workerHours array with segments and hours for each worker
    Object.entries(segmentedData).forEach(([segment, workersHours]) => {
      let segmentData = { segment: segment }; // This will be used as the argumentField for the chart
      Object.entries(workersHours).forEach(([userId, hours]) => {
        // Find the worker's name using the userId
        const workerName = this.workers.find(worker => worker.id === userId)?.name || 'Unknown';
        // Add a new field to segmentData for each worker
        segmentData[workerName] = hours; // This will be used as the valueField for the chart
      });
      this.workerHours.push(segmentData);
    });

    console.log('Final workerHours:', this.workerHours);

    this.workerHoursSum=this.workerHours.reduce((sum, item) => sum+item.worker.name, 0);
  }



}
