import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Picture } from './models/event-dto.model';


@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private apiUrl = 'https://localhost:44387'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  uploadPicture(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.http.post('https://localhost:44387/uploadPicture', formData);
  }

  getPictureById(id: string): Observable<Picture> {
    return this.http.get<Picture>(`https://localhost:44387/api/app/picture/${id}/image`);
  }
  getPictures(): Observable<Picture[]> {
    return this.http.get<any[]>(`https://localhost:44387/getImages`)
      .pipe(map(response => response.map(item => new Picture(item))));
  }

  updatePicture(pictureId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put(`https://localhost:44387/updateImage/${pictureId}`, formData);
  }

  deletePicture(pictureId: string): Observable<any> {
    return this.http.delete(`https://localhost:44387/deleteImage/${pictureId}`);
  }

}
