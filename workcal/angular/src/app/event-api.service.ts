import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto } from './models/event-dto.model'; // Create this model based on your DTO

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private baseUrl: string = 'https://localhost:44387/api/app/event';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.baseUrl}`);
  }

  getEventById(id: string): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.baseUrl}/${id}`);
  }

  createEvent(event: EventDto): Observable<EventDto> {
    return this.http.post<EventDto>(`${this.baseUrl}`, event);
  }

  updateEvent(id: string, event: EventDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`);
  }
}
