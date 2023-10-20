
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  token: string|undefined;

  constructor(private router:Router) {
    this.token = undefined;
  }

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.token}] generated`);
    

  }
  public redirect(){
if(this.token!=undefined){
this.router.navigate(['account']);
  }
  }

}
