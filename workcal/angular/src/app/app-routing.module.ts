import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { WorkerStatisticsComponent } from './worker-statistics/worker-statistics.component';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { DailyEventsComponent } from './daily-events/daily-events.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: 'recaptcha', component: AppComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'statistics', component: WorkerStatisticsComponent },
  { path: 'pictures', component: PictureUploadComponent },
  { path: 'dailyevents', component: DailyEventsComponent },


  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
