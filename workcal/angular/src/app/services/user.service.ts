import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44387';

  constructor(private http: HttpClient) { }

  getUserRole(): Observable<{ role: string }> {
    return this.http.get<{ role: string }>(`${this.apiUrl}/api/app/identity/user-roles`);
  }
  getUserId(): Observable<{ id: string }> {
    return this.http.get<{ id: string }>(`${this.apiUrl}/api/app/identity/current-user-iD`);
  }


}
