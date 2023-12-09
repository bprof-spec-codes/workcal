import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto, LabelDto, Picture } from './models/event-dto.model'; // Create this model based on your DTO

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private baseEventUrl: string = 'https://localhost:44387/api/app/event';
  private baseLabelUrl: string = 'https://localhost:44387/api/app/label';

  constructor(private http: HttpClient) { }

  getEventPictureUrl(eventId: string):  Observable<Picture>  {
    return this.http.get<Picture>(`https://localhost:44387/get-event-picture/${eventId}`);
  }
  getEventsForUserByDate(userId: string, date: string) {
    return this.http.get(`https://localhost:44387/events?userId=${userId}&date=${date}`);
  }

  updateEventGpsData(eventId: string, latitude: number, longitude: number, isInRange: boolean): Observable<any> {
    return this.http.put(`https://localhost:44387/update-gps`, { eventId, latitude, longitude, isInRange });
  }
  uploadPicture(pictureFile: File, eventId: string): Observable<any> {
    const formData = new FormData();
    formData.append('pictureFile', pictureFile);
    formData.append('eventId', eventId);

    return this.http.post('https://localhost:44387/upload', formData);
  }
  createOrUpdateEvent(event: EventDto, file?: File): Observable<any> {
    const formData = new FormData();

    // Append event data to the formData
    formData.append('eventData', new Blob([JSON.stringify(event)], {
      type: "application/json"
    }));

    // Append the file if it exists
    if (file) {
      formData.append('pictureFile', file, file.name);
    }

    // Determine whether it's a create or update operation
    const url = event.id ? `api/events/update/${event.id}` : 'api/events/create';

    return this.http.post(url, formData, {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data' // Ensure enctype is set for file upload
      })
    });
  }



getAllEvents(): Observable<EventDto[] | null> {
    return this.http.get<EventDto[] | null>(`${this.baseEventUrl}`);
}
getAllLabels(): Observable<LabelDto[]> {
  return this.http.get<LabelDto[]>(`${this.baseEventUrl}`); // Update the URL to match your backend endpoint
}

getUniqueLabels(): Observable<LabelDto[]> {
  return this.http.get<LabelDto[]>(`https://localhost:44387/unique`);
}

deleteLabelsByNameAndColor(labelName: string, labelColor: string): Observable<void> {
  const encodedLabelName = encodeURIComponent(labelName);
  const encodedLabelColor = encodeURIComponent(labelColor); // This will convert '#' to '%23'
  const url = `https://localhost:44387/deleteByNameAndColor?labelName=${encodedLabelName}&labelColor=${encodedLabelColor}`;
  return this.http.delete<void>(url);
}

  getEventById(id: string): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.baseEventUrl}/${id}`);
  }

  createEvent(event: EventDto): Observable<EventDto> {
    return this.http.post<EventDto>(`${this.baseEventUrl}`, event);
  }

  updateEvent(id: string, event: EventDto): Observable<void> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = JSON.stringify(event);
    return this.http.put<void>(`${this.baseEventUrl}/${id}`, body, {headers});
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseEventUrl}/${id}`);
  }

  addLabelToEvent(eventId: string, label: LabelDto) {
    return this.http.post(`/api/app/event/${eventId}/labels`, label);
  }

  updateLabel(eventId: string, labelId: string, label: LabelDto) {
    return this.http.put(`/api/app/event/${eventId}/labels/${labelId}`, label);
  }

  deleteLabel(eventId: string, labelId: string) {
    return this.http.delete(`/api/app/event/${eventId}/labels/${labelId}`);
  }


}
