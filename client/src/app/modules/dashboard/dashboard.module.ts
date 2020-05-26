import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarUploadComponent } from './components/avatar-upload/avatar-upload.component';


@NgModule({
  declarations: [DashboardComponent, AvatarUploadComponent],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
