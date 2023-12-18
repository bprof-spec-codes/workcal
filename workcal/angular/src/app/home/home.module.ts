import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule, DxButtonModule]
})
export class HomeModule {}
