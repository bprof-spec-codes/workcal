import { Component } from '@angular/core';
import { UserApiService } from '../user-api.service';
import { PictureService } from '../picture-api.service';
import { EventDto, LabelDto, Picture, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss']
})
export class PictureUploadComponent {
  selectedFile: File | null = null;
  selectedUserId: string | null = null;
  allusers: UserDto[] = [];
  pictures: Picture[] = []; // Replace Picture with your picture model

  constructor(private userApiService: UserApiService, private pictureService: PictureService) {}

  ngOnInit() {
    this.fetchUsers();

    this.fetchPictures();

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  fetchUsers(): void {
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
          this.allusers = data.items.map(user => ({
            id: user.id,
            userName: user.userName,
            name: user.name,
            email: user.email
          }));
        } else {
          console.error('Items key not found in response:', data);
        }
      });

  }
  uploadPicture() {
    if (this.selectedFile && this.selectedUserId) {
      this.pictureService.uploadPicture(this.selectedFile, this.selectedUserId)
        .subscribe({
          next: () => {
            // Handle success
          },
          error: () => {
            // Handle error
          }
        });
    } else {
      // Handle invalid input
    }
  }




  fetchPictures() {
    this.pictureService.getPictures().subscribe(pictures => {
      this.pictures = pictures;
      console.log(pictures);

    });
  }

  updatePicture(pictureId: string, event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pictureService.updatePicture(pictureId, file).subscribe(() => {
        this.fetchPictures(); // Refresh the list
      });
    }
  }

  deletePicture(pictureId: string) {
    this.pictureService.deletePicture(pictureId).subscribe(() => {
      this.fetchPictures(); // Refresh the list
    });
  }
}
