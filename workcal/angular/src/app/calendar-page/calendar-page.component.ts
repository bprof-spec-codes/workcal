import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, LabelDto, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule, DxButtonComponent  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { UserApiService } from '../user-api.service';
import { Location } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { PictureService } from '../picture-api.service';
import { BingMapsService } from '../geocoding.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})


export class CalendarPageComponent implements OnInit {

  latitude: string = 'Not captured';
  longitude: string = 'Not captured';
  currentLocation: { latitude?: number, longitude?: number } = {};

  todayEvents: SchedulerEvent[] = [];

  events: EventDto[] = [];
  schedulerEvents: SchedulerEvent[] = [];

  selectedEvent: EventDto;

  dynamicUniqueLabels: LabelDto[] = [];

  userRole: string;
  currentUserId: string;
  isWorker: boolean;

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


  constructor(private eventApiService: EventApiService, private userApiService: UserApiService , private bingMapsService: BingMapsService,   private renderer: Renderer2
,  private pictureService: PictureService ,private router: Router, private userService: UserService )
  {   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchUniqueLabels();
    this.getUserRole();
  }

  refreshPage() {
    //this.router.navigate([this.router.url]);
  }

  ngAfterViewInit(): void {
    // Here you can safely manipulate the DOM or interact with rendered elements
    const button = document.getElementById('capture-location-button');
    if (button) {
      button.addEventListener('click', () => this.captureCurrentLocation());
    }
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
        } else {
          this.isWorker = false;
        }

        // Fetch workers and events after getting the role
        this.fetchEvents();
      },
      error => {
        console.error('Error fetching user role', error);
      }
    );
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

  createEvent(newEvent: EventDto): void {
    this.eventApiService.createEvent(newEvent).subscribe(
      (response) => {
        this.fetchEvents();
      },
      (error) => {
        console.error('Error creating event:', error);
      }
    );
    console.log(this.allusers);
    this.refreshPage();

  }


  updateEvent(eventToUpdate: EventDto): void {
    this.eventApiService.updateEvent(eventToUpdate.id, eventToUpdate).subscribe( () => {
      this.fetchEvents();
    },
    (error) => {
      console.error('Error updating event:', error);
    }

  );
  this.fetchEvents();
  this.refreshPage();

  }

  deleteEvent(eventId: string): void {
    const index = this.events.findIndex(event => event.id === eventId);
    if (index !== -1) {
      this.eventApiService.deleteEvent(eventId).subscribe(() => {
        this.events.splice(index, 1);
        this.fetchEvents();
      });
    }
    this.refreshPage();

  }

  deleteLabelPermanent(labelname: string,labelcolor: string): void {
    console.log(labelname,labelcolor );
    this.eventApiService.deleteLabelsByNameAndColor(labelname, labelcolor)
      .subscribe(() => {
        this.fetchUniqueLabels(); // Refresh the label list
      });
      this.refreshPage();

  }


  onEventAdding(event): void {
    console.log("kiskutya", event);
    const appointmentData = event.appointmentData;
    if(event.appointmentData.allDay){
      event.appointmentData.endDate = new Date(event.appointmentData.endDate);
      event.appointmentData.endDate = new Date(event.appointmentData.endDate.getTime() + (24 * 60 * 60 * 1000));
    }
    const selectedLabels = this.dynamicUniqueLabels .filter(label =>
      appointmentData.labels?.includes(label.name)
    );

      const selectedUsers = appointmentData.users.filter(user =>
        appointmentData.users?.includes(user.name)
      );

      const selectedUserIDs = appointmentData.users;



    const newEvent: EventDto = {
      name: appointmentData.text,
      startTime: new Date(new Date(appointmentData.startDate).getTime() + 60 * 60 * 1000),
      endTime: new Date(new Date(appointmentData.endDate).getTime() + 60 * 60 * 1000),
      locationString: appointmentData.location || '',
      labels: selectedLabels,
      users:  selectedUserIDs,
      isInRange: appointmentData.isInRange ,
      description:  appointmentData.description || '',

    };

    this.createEvent(newEvent);
    this.fetchEvents();
    this.refreshPage();

  }


  onAppointmentDragStart(event): void {
    this.draggedEventLabels = event.itemData.labels;

  }

  onAppointmentDragEnd(event): void {
    if (event.fromComponent === event.toComponent) {
      const appointmentData = event.itemData;
      appointmentData.labels = this.draggedEventLabels;
      this.updateEvent(appointmentData);
    }
    this.fetchEvents();
    this.refreshPage();

  }

  onEventUpdating(event): void {

    //console.log("Event data before any operation: ", JSON.stringify(event));

    const appointmentData = event.newData;
    const appointmentDataOld = event.oldData;
    console.log('New appointmentData:', appointmentData);
    console.log('Initial appointmentData.users:', appointmentData.users);

    if (!appointmentDataOld.id) {
      console.error("Event ID is missing, cannot update");
      return;
    }

    appointmentData.labels = appointmentData.labels || [];
    appointmentDataOld.labels = appointmentDataOld.labels || [];

    let selectedLabels = [];

    if (this.labelsInteractedWith) {
      selectedLabels = this.dynamicUniqueLabels .filter(label => appointmentData.labels.includes(label.name));
    } else {
      selectedLabels = appointmentDataOld.labels;
    }


    appointmentData.users = appointmentData.users.map(userId => {
      return this.allusers.find(user => user.id === userId) || userId;
    });

    console.log('New appointmentData:', appointmentData.users);

    let selectedUserIDs: UserDto[] = [];

    // Check the type of the first element in the array
    if (Array.isArray(appointmentData.users) && appointmentData.users.length > 0) {
      if (typeof appointmentData.users[0] === 'string') {
        // It's an array of IDs (strings)
        selectedUserIDs = appointmentData.users;
      } else if (typeof appointmentData.users[0] === 'object') {
        // It's an array of objects
        selectedUserIDs = appointmentData.users.map(user => user.id);
      }
    } else {
      // Handle other cases or set to an empty array if needed
      selectedUserIDs = [];
    }



   // console.log("appointmentData before any operation: ", JSON.stringify(appointmentData));

    const updatedEvent: EventDto = {
      id: appointmentDataOld.id,
      name: appointmentData.name,
      startTime: new Date(new Date(appointmentData.startDate).getTime() + 60 * 60 * 1000),
      endTime: new Date(new Date(appointmentData.endDate).getTime() + 60 * 60 * 1000),
      locationString: appointmentData.location || '',
      labels: selectedLabels,
      users: selectedUserIDs,
      isInRange: appointmentData.isInRange,
      description: appointmentData.description || '',


    };

    console.log('Final selectedUserIDs:', selectedUserIDs);


    this.updateEvent(updatedEvent);
    this.labelsInteractedWith = false;
    this.fetchEvents();
    this.refreshPage();

  }



  onEventDeleting(event: {
    cancel: boolean; appointmentData: SchedulerEvent
}): void {
    const appointmentData = event.appointmentData;

    if (!appointmentData.id) {
      console.error("Event ID is missing, can not delete");
      event.cancel = true;
      return;
    }


    this.deleteEvent(appointmentData.id);
    this.fetchEvents();
    this.refreshPage();

  }


// Function to create a new label and update dynamicUniqueLabels
createNewLabel(): void {
  if (this.newLabel.name && this.newLabel.color) {
    // Update the dynamicUniqueLabels  array
    this.dynamicUniqueLabels .push({
      name: this.newLabel.name,
      color: this.newLabel.color
    });

    // Reset newLabel for next use
    this.newLabel = { name: '', color: '#000000' };

    // Close the popup
    this.labelPopupVisible = false;
  } else {
    console.error('Label Name and Color are required.');
  }

}




labelsInteractedWith: boolean = false;

onAppointmentFormOpening(data: { form: any, appointmentData: SchedulerEvent }): void {
  const form = data.form;



    const oldAppointmentData = data.appointmentData;

    if (oldAppointmentData.labels) {
      form.updateData('labels', oldAppointmentData.labels.map(l => l.name));
    }
    if (!oldAppointmentData.locationString) {
      form.updateData('location', '');
    }
    if (!oldAppointmentData.description) {
      form.updateData('description', '');
    }
    if (oldAppointmentData.locationString) {
      form.updateData('location', oldAppointmentData.locationString);
    }
    if (oldAppointmentData.description) {
      form.updateData('description', oldAppointmentData.description);
    }



  if (!oldAppointmentData.name) {
    form.updateData('text', '');
  }
  if (oldAppointmentData.name) {
    form.updateData('text', oldAppointmentData.name);
  }


    if (!oldAppointmentData.labels) {
      form.updateData('labels', []);
    }
    if (!oldAppointmentData.pictureData) {
      form.updateData('Event Picture', []);
    }



    console.log("Description:", oldAppointmentData.name);









    this.selectedEventId = oldAppointmentData.id;
    //this.fetchEventPicture(this.selectedEventId);
    const image = data.appointmentData.pictureData
    const locationString = data.appointmentData.locationString

    this.fetchCoordinates(locationString).subscribe(addressCoords => {
      // ... existing logic to handle coordinates ...
    }, error => {
      console.error('Error fetching coordinates:', error);
    });


    let locationStatus = 'Checking location...';
    let distanceToLocation = null;

    const isInRange = oldAppointmentData.isInRange;


    const updateLocationStatus = (isInRange, distance) => {
      locationStatus = isInRange ? 'Inside location range' : 'Outside location range';
      distanceToLocation = isInRange ? null : `Get ${distance.toFixed(2)} meters closer`;
      form.repaint(); // Refresh the form to update the display
    };

    console.log('GPS data range isinrange', oldAppointmentData.isInRange);

    let rangeStatus = 'Range status unknown';
    if (typeof data.appointmentData.isInRange === 'boolean') {
      rangeStatus = data.appointmentData.isInRange ? 'Within range' : 'Out of range';
    }

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
            label: { text: 'Event Picture' },
            template: () => {
              return `
                <div>
                  <input type="file" id="event-picture-input" (change)="onFileSelected($event)" />
                </div>
              `;
            }
          },
          {
            label: { text: 'Event Picture' },
            template: () => {
              return `
                <a href="data:application/octet-stream;base64,${data.appointmentData.pictureData}" target="_blank">
                  <img src="data:image/jpeg;base64,${data.appointmentData.pictureData}"
                       alt="Event Image"
                       style="height: 150px; width: 150px; object-fit: cover; border-radius: 10px; margin: 5px;" />
                </a>
              `;
            }
          }
          ,
          {
            itemType: 'button',
            horizontalAlignment: 'left',
            buttonOptions: {
              text: 'Print this event',
              onClick: () => {
                window.print();

              }
            }
          },
        {
          dataField: 'labels',
          editorType: 'dxTagBox',
          editorOptions: {
            dataSource: this.dynamicUniqueLabels ,
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
        },
        {
          dataField: 'newLabelName',
          editorType: 'dxTextBox',
          editorOptions: {
            placeholder: 'Enter new label name...'
          },
          label: {
            text: 'New Label Name'
          }
        },
        {
          dataField: 'newLabelColor',
          editorType: 'dxColorBox',
          editorOptions: {
            placeholder: 'Pick a color...'
          },
          label: {
            text: 'New Label Color'
          }
        },

        {
          itemType: 'button',
          horizontalAlignment: 'left',
          buttonOptions: {
            text: 'Create Label',
            onClick: () => {
              const newLabelName = form.option('formData').newLabelName;
              const newLabelColor = form.option('formData').newLabelColor;

              if (newLabelName && newLabelColor) {
                // Add the new label to the default labels array
                this.dynamicUniqueLabels .push({
                  name: newLabelName,
                  color: newLabelColor
                });

                // Clear the fields
                form.updateData('newLabelName', '');
                form.updateData('newLabelColor', '');

                // Optionally, you can add this new label to the current event's label list
                const existingLabels = form.option('formData').labels || [];
                form.updateData('labels', [...existingLabels, newLabelName]);
              }
            }
          }
        },
        {
          itemType: 'button',
          horizontalAlignment: 'left',
          buttonOptions: {
            text: 'Submit GPS Data',
            onClick: () => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const latitude = position.coords.latitude.toFixed(6);
                    const longitude = position.coords.longitude.toFixed(6);

                    // Assuming 'fetchCoordinates' and 'isWithinRange' are defined in your component
                    this.fetchCoordinates(oldAppointmentData.locationString).subscribe(addressCoords => {
                      const isInRange = this.isWithinRange({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, addressCoords, 10000); // Adjust the threshold as needed

                      // Call your service to submit GPS data
                      this.eventApiService.updateEventGpsData(oldAppointmentData.id, parseFloat(latitude), parseFloat(longitude), isInRange)
                        .subscribe(() => {
                          // Handle success
                          console.log('GPS data submitted successfully');
                        }, error => {
                          // Handle error
                          console.error('Error submitting GPS data:', error);
                        });
                    });
                  },
                  (error) => {
                    console.error('Error capturing location:', error);
                  }
                );
              } else {
                console.error('Geolocation is not supported by this browser.');
              }
            }
          }
        },

        {
          label: { text: 'Is in range' },

          template: () => {

            console.log('GPS data range rangeStatus', rangeStatus);

            return `<div><span>${rangeStatus}</span></div>`;

          }



        },
        {
        dataField: 'users',
    editorType: 'dxTagBox',
    editorOptions: {
      dataSource: this.allusers,
      displayExpr: 'userName',
      valueExpr: 'id',
      placeholder: 'Assign to...',
      onValueChanged: (e) => {
        const selectedUserIDs = e.value.map(userObjOrId => {
          return typeof userObjOrId === 'object' ? userObjOrId.id : userObjOrId;
        });

        data.appointmentData.users = selectedUserIDs;

        console.log("Updated appointmentData.users:", data.appointmentData.users);
      },
      onItemRemoved: (e) => {
        // This event should be triggered when an item is removed.
        // Add your custom logic here.

        // You can access the removed item using e.itemData or e.itemElement depending on your needs
      }
    },
    label: {
      text: 'Assign To'
    }
        },

      ]
    });

    form.getEditor('labels').option('onValueChanged', () => {
      this.labelsInteractedWith = true;
    });

    setTimeout(() => {
      const fileInput = document.getElementById('event-picture-input');
      fileInput.addEventListener('change', this.onFileSelected.bind(this));
    }, 0);


    this.fetchEvents();
    this.refreshPage();

  }

  openLabelPopup(): void {
    this.labelPopupVisible = true;
  }

  normalizeUserData(user: any): UserDto {
    return {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email
    };


  }

  private calculateDistance(coord1: { latitude: number, longitude: number }, coord2: { latitude: number, longitude: number }): number {
    const earthRadiusInMeters = 6371000; // Earth's radius in meters

    const dLat = this.degreesToRadians(coord2.latitude - coord1.latitude);
    const dLon = this.degreesToRadians(coord2.longitude - coord1.longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.degreesToRadians(coord1.latitude)) * Math.cos(this.degreesToRadians(coord2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusInMeters * c;

    return distance; // Distance in meters
  }



  fetchCoordinates(address: string): Observable<{ latitude: number, longitude: number }> {
    return new Observable(observer => {
        this.bingMapsService.getCoordinates(address).subscribe(
            response => {
                if (response && response.latitude && response.longitude) {
                    observer.next({ latitude: response.latitude, longitude: response.longitude });
                    observer.complete();
                } else {
                    console.error('No results found for the address');
                    observer.error('No results found');
                }
            },
            error => {
                console.error('Error fetching coordinates:', error);
                observer.error(error);
            }
        );
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





  isWithinRange(coord1: { latitude: number, longitude: number }, coord2: { latitude: number, longitude: number }, thresholdInMeters: number): boolean {
    const earthRadiusInMeters = 6371000; // Earth's radius in meters

    const dLat = this.degreesToRadians(coord2.latitude - coord1.latitude);
    const dLon = this.degreesToRadians(coord2.longitude - coord1.longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(coord1.latitude)) * Math.cos(this.degreesToRadians(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusInMeters * c;

    return distance <= thresholdInMeters;
  }

  degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }




  fetchEventPicture(eventId: string): Observable<string | null> {
    return this.eventApiService.getEventPictureUrl(eventId).pipe(
      map(response => {
        if (response && response.imageData) {
          return `data:${response.contentType};base64,${response.imageData}`;
        }
        return null; // Return null if no image data
      })
    );
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }

    if (this.selectedFile && this.selectedEventId) {
      this.eventApiService.uploadPicture(this.selectedFile, this.selectedEventId).subscribe({
        next: (response) => {
          console.log('Picture uploaded successfully', response);
        },
        error: (error) => {
          console.error('Error uploading picture', error);
        }
      });
    } else {
      console.error('No file selected or event ID missing');
    }
  }





}
