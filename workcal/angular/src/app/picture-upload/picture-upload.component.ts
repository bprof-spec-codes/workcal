import { Component } from '@angular/core';
import { UserApiService } from '../user-api.service';
import { PictureService } from '../picture-api.service';
import { EventDto, LabelDto, Picture, SchedulerEvent , UserDto, UserResponse } from '../models/event-dto.model';
import { catchError, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



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
  http: HttpClient;
  userIdToUserNameMap: { [userId: string]: string } = {};



  userRole: string;
  constructor(private userApiService: UserApiService, private pictureService: PictureService,private userService: UserService,private router: Router, http:HttpClient) {
    this.http = http;
  }

  ngOnInit() {
    this.getUserRole();
    this.fetchUsers();
    this.fetchPictures();

  }

  getUserRole(): void {

    this.userService.getUserRole().subscribe(
      response => {
        this.userRole = response.role;
        if(this.userRole!="admin"){
          this.router.navigate(['']);
         }
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
          return of([]);
        })
      )
      .subscribe((data: UserResponse | any[]) => {
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

          // Populate userIdToUserNameMap
          this.userIdToUserNameMap = this.allusers.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
          }, {});
        } else {
          console.error('Items key not found in response:', data);
        }
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  uploadPicture() {
    if (this.selectedFile && this.selectedUserId) {
      this.pictureService.uploadPicture(this.selectedFile, this.selectedUserId)
        .subscribe({
          next: (response) => {
            console.log('Picture uploaded successfully', response);
            this.fetchPictures();
          },
          error: (error) => {
            console.error('Error uploading picture', error);
          }
        });
      } else {
        console.error('No file selected or event ID missing');
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
    this.http.delete(`https://localhost:44387/deleteImage?id=${pictureId}`)
      .subscribe(() => {
        this.fetchPictures(); // Refresh the list
      });
  }

}
