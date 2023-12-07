import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto, LabelDto } from './models/event-dto.model'; // Create this model based on your DTO

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private baseEventUrl: string = 'https://localhost:44387/api/app/event';
  private baseLabelUrl: string = 'https://localhost:44387/api/app/label';

  constructor(private http: HttpClient) { }

  uploadPicture(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.http.post('https://localhost:44387/upload', formData, {
      headers: { 'enctype': 'multipart/form-data' }
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
    return this.http.put<void>(`${this.baseEventUrl}/${id}`, event);
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
