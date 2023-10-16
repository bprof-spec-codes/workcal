import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { EventDto, SchedulerEvent , UserDto } from '../models/event-dto.model';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxColorBoxModule  } from 'devextreme-angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserApiService } from '../user-api.service';


@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})


export class CalendarPageComponent implements OnInit {
  events: EventDto[] = [];
  schedulerEvents: SchedulerEvent[] = [];

  selectedEvent: EventDto;

  currentDate: Date = new Date();
  currentView: string = 'day';
   draggedEventLabels;

   labelPopupVisible: boolean = true;
   newLabel: { name: string, color: string } = { name: '', color: '#000000' };

   users: UserDto[] = [];


defaultLabels: Array<{ name: string, color: string }> = [
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


  constructor(private eventApiService: EventApiService, private userApiService: UserApiService ,private router: Router)
  {   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';}

  ngOnInit(): void {
    this.fetchEvents();

  }

  refreshPage() {
    this.router.navigate([this.router.url]);
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
          location: event.location,
          labels: event.labels,
          userIds: event.userIds || []
        }));
      });
  }

  fetchUsers(): void {
    this.userApiService.getAllUsers().subscribe(data => {
      this.users = data;
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

  onEventAdding(event): void {
    const appointmentData = event.appointmentData;

    const selectedLabels = this.defaultLabels.filter(label =>
      appointmentData.labels?.includes(label.name)
    );





    const newEvent: EventDto = {
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: selectedLabels,
      userIds: appointmentData.userIds || []
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

  }

  onEventUpdating(event): void {
    const appointmentData = event.newData;
    const appointmentDataOld = event.oldData;

    if (!appointmentDataOld.id) {
      console.error("Event ID is missing, cannot update");
      return;
    }

    appointmentData.labels = appointmentData.labels || [];
    appointmentDataOld.labels = appointmentDataOld.labels || [];

    let selectedLabels = [];

    if (this.labelsInteractedWith) {
      selectedLabels = this.defaultLabels.filter(label => appointmentData.labels.includes(label.name));
    } else {
      selectedLabels = appointmentDataOld.labels;
    }

    const updatedEvent: EventDto = {
      id: appointmentDataOld.id,
      name: appointmentData.text,
      startTime: new Date(appointmentData.startDate),
      endTime: new Date(appointmentData.endDate),
      location: appointmentData.location || '',
      labels: selectedLabels,
      userIds: appointmentData.userIds || []
    };

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

  }


// Function to create a new label and update defaultLabels
createNewLabel(): void {
  if (this.newLabel.name && this.newLabel.color) {
    // Update the defaultLabels array
    this.defaultLabels.push({
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
    if (!oldAppointmentData.location) {
      form.updateData('location', '');
    }
    if (!oldAppointmentData.labels) {
      form.updateData('labels', []);
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
          dataField: 'labels',
          editorType: 'dxTagBox',
          editorOptions: {
            dataSource: this.defaultLabels,
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
                this.defaultLabels.push({
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
          dataField: 'userIds',
          editorType: 'dxTagBox',
          editorOptions: {
            dataSource: this.users,  // <-- Use the fetched list of users here
            displayExpr: 'username',
            valueExpr: 'id',
            placeholder: 'Assign to...'
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
    this.fetchEvents();

  }


  openLabelPopup(): void {
    this.labelPopupVisible = true;
  }

}
