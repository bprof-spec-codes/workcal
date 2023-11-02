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

  constructor(private eventService: EventApiService) {}

  ngOnInit(): void {
    this.fetchEventsAndCalculateHours();
  }

  fetchEventsAndCalculateHours(): void {
    this.eventService.getAllEvents().subscribe(events => {
      // Assume events have a structure where each event has a startDate, endDate, and users array
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
}
