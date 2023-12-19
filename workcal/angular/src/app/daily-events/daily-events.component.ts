import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, LabelDto, SchedulerEvent , UserDto, UserResponse, dailyEvent } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule, DxButtonComponent  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { UserApiService } from '../user-api.service';
import { Location, formatDate } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { PictureService } from '../picture-api.service';
import { BingMapsService } from '../geocoding.service';
import * as marked from 'marked';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-daily-events',
  templateUrl: './daily-events.component.html',
  styleUrls: ['./daily-events.component.scss']
})
export class DailyEventsComponent implements OnInit {


  latitude: string = 'Not captured';
  longitude: string = 'Not captured';
  currentLocation: { latitude?: number, longitude?: number } = {};

  todayEvents: SchedulerEvent[] = [];

  events: EventDto[] = [];
  schedulerEvents: SchedulerEvent[] = [];

  selectedEvent: EventDto;

  dynamicUniqueLabels: LabelDto[] = [];

  currentDate: Date = new Date();
  currentView: string = 'day';
   draggedEventLabels;

   labelPopupVisible: boolean = true;
   newLabel: { name: string, color: string } = { name: '', color: '#000000' };

   allusers: UserDto[] = [];
   normalizedUserIDs: string[] = [];
   selectedFile: File | null = null;

   selectedEventId: string;
   selectedEventPicture: string;

   defaultLabels : Array<{ name: string, color: string }> = [
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
  httpClient: any;

  currentDayEvents: SchedulerEvent[] = []; // Add this to store today's events


  constructor(private sanitizer: DomSanitizer,private eventApiService: EventApiService, private userApiService: UserApiService , private bingMapsService: BingMapsService,   private renderer: Renderer2,  private pictureService: PictureService ,private router: Router )
 {   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   this.router.onSameUrlNavigation = 'reload';}

 ngOnInit(): void {
   this.fetchUsers();
   this.fetchUniqueLabels();
   this.fetchCurrentDayEvents();
 }

 refreshPage() {
   //this.router.navigate([this.router.url]);
 }

  convertMarkdownToHtml(markdown: string): string {
    const html = marked.parse(markdown) as string; // Type assertion here
    return html;
  }

  getHtmlContent(markdown: string) {
    const rawHtml = this.convertMarkdownToHtml(markdown);
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

 ngAfterViewInit(): void {
   // Here you can safely manipulate the DOM or interact with rendered elements
   const button = document.getElementById('capture-location-button');
   if (button) {
     button.addEventListener('click', () => this.captureCurrentLocation());
   }
 }

 fetchUsers(): void {
   this.userApiService.getAllUsers()
     .pipe(
       catchError(error => {
         console.error('Error fetching users:', error);
         return of({ items: [] } as UserResponse); // Provide a fallback value
       }),
       switchMap((response: UserResponse) => {
         if (response.items.length === 0) {
           return of([]); // If no users, return an empty array
         }
         // Create an array of observables for each user to fetch the picture
         const userObservables = response.items.map(user =>
           this.pictureService.getPictureById(user.id).pipe(
             catchError(() => of(undefined)), // Handle errors in image fetching
             map(picture => ({
               ...user,
               imageUrl: picture ? picture.imageData : undefined
             }))
           )
         );
         return forkJoin(userObservables); // Combine all observables
       }),
       finalize(() => {
         this.fetchEvents(); // Call fetchEvents after all user images are loaded
       })
     )
     .subscribe(usersWithImages => {
       this.allusers = usersWithImages;
     });
 }




 fetchEvents(): void {
   this.eventApiService.getAllEvents()
     .pipe(
       catchError(error => {
         console.error('Error fetching events:', error);
         return of([]);
       })
     )
     .subscribe(data => {
       this.events = data;
       this.schedulerEvents = data.map(event => ({
         id: event.id,
         startDate: event.startTime,
         endDate: event.endTime,
         name: event.name,
         locationString: event.locationString,
         pictureData: event.pictureData,
         labels: event.labels,
         isInRange: event.isInRange,
         description: event.description,

         users: event.users.map(user => {
           // Find the corresponding user in 'allusers' to get the 'imageUrl'
           const userWithImage = this.allusers.find(u => u.id === user.id);
           return {
             id: user.id,
             userName: user.userName,
             imageUrl: userWithImage ? userWithImage.imageUrl : undefined // Set imageUrl here
           };

         }),

       }));
       console.log('fetchEvents');

       console.log(data);

     });
 }



 fetchUniqueLabels(): void {
   this.eventApiService.getUniqueLabels()
     .subscribe(labels => {
       this.dynamicUniqueLabels = labels;
     });
 }



 captureCurrentLocation(): void {
  // Use Geolocation API to capture current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude.toFixed(6);
        this.longitude = position.coords.longitude.toFixed(6);
      },
      (error) => {
        console.error('Error capturing location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}


fetchCurrentDayEvents(): void {
  this.eventApiService.getAllEvents()
    .pipe(
      catchError(error => {
        console.error('Error fetching events:', error);
        return of([] as EventDto[]); // Provide a typed fallback value
      }),
      map(events => this.filterEventsForCurrentDay(events)) // Filter the events for the current day
    )
    .subscribe(filteredEvents => {
      this.currentDayEvents = filteredEvents.map(event => this.mapEventToSchedulerEvent(event));
    });
}

private filterEventsForCurrentDay(events: EventDto[]): EventDto[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set to start of the day

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999); // Set to end of the day

  return events.filter(event => {
    const eventStart = new Date(event.startTime);
    return eventStart >= todayStart && eventStart <= todayEnd;
  });
}


private mapEventToSchedulerEvent(event: EventDto): dailyEvent {
  // Map EventDto to SchedulerEvent, handling null values
  return {
    id: event.id || '',
    startDate: event.startTime || new Date(),
    endDate: event.endTime || new Date(),
    name: event.name || '',
    locationString: event.locationString || '',
    labels: event.labels || [],
    users: event.users || [],
    pictureData: event.pictureData || '',
    isInRange: event.isInRange || false,
    description: event.description || '',
    labelNames: event.labels?.map(label => label.name).join(', ') || '',
    userNames: event.users?.map(user => user.name).join(', ') || ''
  };
}
print() {
  window.print();
}

}
