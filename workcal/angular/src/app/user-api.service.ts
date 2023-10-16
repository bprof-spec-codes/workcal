import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from './models/event-dto.model'; // Create this model based on your DTO

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private baseUrl: string = 'https://localhost:44387/api/identity/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDto[] | null> {
    return this.http.get<UserDto[] | null>(`${this.baseUrl}`);
}

  getUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/${id}`);
  }

}
