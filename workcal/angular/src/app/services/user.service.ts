import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44387'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getUserRole(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/api/app/identity/user-roles`);
  }
}
