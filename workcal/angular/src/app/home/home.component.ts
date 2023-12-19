import { AuthService } from '@abp/ng.core';
import { UserService} from '../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit{
  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  userRole: string;

  constructor(private authService: AuthService, public userService: UserService) {}

  ngOnInit(): void {
    this.getUserRole();
  }
  login() {
    this.authService.navigateToLogin();
  }

  getUserRole(): void {
    console.log('Fetching user role...');
    this.userService.getUserRole().subscribe(
      response => {
        console.log('API Response:', response);
        this.userRole = response.role;
      },
      error => {
        console.error('Error fetching user role', error);
      }
    );
  }
  IsAdmin(){
if (this.userRole=="admin") {
  return true;
}else{
  return false;
}
  }

  IsLoggedIn():boolean{
    if(this.userRole=="admin"||this.userRole=="manager"||this.userRole=="worker"){
      return true;
    } else {
      return false;
    }
  }

}
