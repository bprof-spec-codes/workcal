import { AccountConfigModule } from '@abp/ng.account/config';
import { CoreModule } from '@abp/ng.core';
import { registerLocale } from '@abp/ng.core/locale';
import { IdentityConfigModule } from '@abp/ng.identity/config';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { TenantManagementConfigModule } from '@abp/ng.tenant-management/config';
import { ThemeLeptonXModule } from '@abp/ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@abp/ng.theme.lepton-x/layouts';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { AbpOAuthModule } from '@abp/ng.oauth';
import {
  DxSchedulerModule,
  DxDraggableModule,
  DxScrollViewModule,
  DxColorBoxModule,
  DxCheckBoxModule, DxDropDownBoxModule, DxListModule
} from 'devextreme-angular';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MatChipsModule } from '@angular/material/chips';
import { WorkerStatisticsComponent } from './worker-statistics/worker-statistics.component';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { DxDateBoxModule } from 'devextreme-angular';
import { DxButtonModule } from 'devextreme-angular';
import { NgxPrintModule } from 'ngx-print';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { DailyEventsComponent } from './daily-events/daily-events.component';
import { MatCardModule } from '@angular/material/card';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  imports: [
    MatCardModule,
    NgxPrintModule,
    DxDateBoxModule,
    DxDataGridModule,
    DxChartModule,
    DxSelectBoxModule,
    DxButtonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatChipsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale()
    }),
    AbpOAuthModule.forRoot(),
    ThemeSharedModule.forRoot(),
    AccountConfigModule.forRoot(),
    IdentityConfigModule.forRoot(),
    TenantManagementConfigModule.forRoot(),
    SettingManagementConfigModule.forRoot(),
    ThemeLeptonXModule.forRoot(),
    SideMenuLayoutModule.forRoot(),
    FeatureManagementModule.forRoot(),
    DxSchedulerModule,
    DxDraggableModule,
    DxScrollViewModule,
    DxColorBoxModule,
    DxCheckBoxModule,
    DxDropDownBoxModule,
    DxListModule
  ],
  declarations: [AppComponent, CalendarPageComponent, WorkerStatisticsComponent, PictureUploadComponent, DailyEventsComponent],
  providers: [APP_ROUTE_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
