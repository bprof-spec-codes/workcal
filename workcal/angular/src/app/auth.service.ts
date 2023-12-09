import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  getCurrentUserId(): string | null {
    // Replace 'userId' with the actual key you use to store the user ID
    return localStorage.getItem('userId');
  }

}
