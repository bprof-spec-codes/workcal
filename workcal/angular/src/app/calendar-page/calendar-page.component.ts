import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, LabelDto, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule, DxButtonComponent  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { UserApiService } from '../user-api.service';
import { Location } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { PictureService } from '../picture-api.service';


@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})


export class CalendarPageComponent implements OnInit {



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


  constructor(private eventApiService: EventApiService, private userApiService: UserApiService ,    private renderer: Renderer2
,  private pictureService: PictureService ,private router: Router )
  {   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchUniqueLabels();

  }

  refreshPage() {
    //this.router.navigate([this.router.url]);
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
          text: event.name,
          locationString: event.locationString,
          labels: event.labels,
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
    const appointmentData = event.appointmentData;

    const selectedLabels = this.dynamicUniqueLabels .filter(label =>
      appointmentData.labels?.includes(label.name)
    );

      const selectedUsers = appointmentData.users.filter(user =>
        appointmentData.users?.includes(user.name)
      );

      const selectedUserIDs = appointmentData.users;



    const newEvent: EventDto = {
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      locationString: appointmentData.location || '',
      labels: selectedLabels,
      users:  selectedUserIDs,

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
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      locationString: appointmentData.location || '',
      labels: selectedLabels,
      users: selectedUserIDs,
      pictureData: this.selectedEvent?.pictureData // Add this line

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
      console.error("Event ID is missing, cannot delete");
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

// Implement the AfterViewInit lifecycle hook to access the DOM elements



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
    if (!oldAppointmentData.labels) {
      form.updateData('labels', []);
    }

    this.selectedEventId = oldAppointmentData.id;

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





/*
  onPictureSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFile = file;

      // Create a FileReader to read the file
      const reader = new FileReader();

      // Define the onload event handler for the FileReader
      reader.onload = (e: any) => {
        // The file's text will be in e.target.result
        const base64String = e.target.result;

        // Now the base64String contains the image data in Base64 format
        // You can use this string to send it to the server or do other processing
        console.log(base64String); // For debugging

        // Assuming you have a property in your event DTO to hold the picture data
        if (this.selectedEvent) {

          console.log('selectedEventy');

          this.selectedEvent.pictureData = base64String;

          var selectedid = this.selectedEvent.id;

          this.eventApiService.uploadPicture(this.selectedFile, selectedid).subscribe({
            next: (response) => {
                console.log('Picture uploaded successfully', response);
                // Additional logic after successful upload
            },
            error: (error) => {
                console.error('Error uploading picture', error);
            }
        });
        }
      };

      // Read the file as a Data URL (Base64)
      reader.readAsDataURL(file);
    }


  }

  uploadPicture(): void {
    console.log('uploadPicture called');

    if (this.selectedFile && this.selectedEvent && this.selectedEvent.id) {
      console.log('selectedFile and selectedEvent are present');

      // Logic to upload the picture
      this.eventApiService.uploadPicture(this.selectedFile, this.selectedEvent.id).subscribe({
        next: (response) => {
          console.log('Picture uploaded successfully', response);
          // Additional logic after successful upload
        },
        error: (error) => {
          console.error('Error uploading picture', error);
        }
      });
    } else {
      console.error('Selected file or event is missing');
      // Handle the case where the file or event is not available
    }
  }


  createOrUpdateEvent(): void {
    if (this.selectedEvent) {
      if (this.selectedEvent.pictureFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedEvent.pictureData = e.target.result;
          console.log("Picture data:", this.selectedEvent.pictureData); // Add this log
          this.sendEventToServer();
        };
        reader.readAsDataURL(this.selectedEvent.pictureFile);
      } else {
        this.sendEventToServer();
      }
    }
  }
*/

  private sendEventToServer(): void {
    console.log("Sending event data:", this.selectedEvent);
    this.eventApiService.createOrUpdateEvent(this.selectedEvent).subscribe({
      next: (response) => {
        console.log('Event successfully saved', response);
        // Refresh events or perform other actions as needed
      },
      error: (error) => {
        console.error('Error saving event', error);
      }
    });
  }

}
