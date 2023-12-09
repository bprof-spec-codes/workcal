import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, LabelDto, SchedulerEvent, UserDto, UserResponse } from '../models/event-dto.model';

@Component({
  selector: 'app-daily-events',
  templateUrl: './daily-events.component.html',
  styleUrls: ['./daily-events.component.scss']
})
export class DailyEventsComponent implements OnInit {
  events = [];

  constructor(
    private eventService: EventApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchEventsForToday();
  }

  fetchEventsForToday() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      // Fetch events for today using userId
    } else {
      console.error('User ID is not available');
    }
  }
}
