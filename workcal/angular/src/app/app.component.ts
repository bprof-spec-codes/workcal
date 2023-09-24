import { Component } from '@angular/core';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar></abp-loader-bar>
    <abp-dynamic-layout></abp-dynamic-layout>


  `,
})
export class AppComponent {}
