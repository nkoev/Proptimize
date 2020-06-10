import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarUploadComponent } from './components/avatar-upload/avatar-upload.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserProjectsComponent } from './components/user-projects/user-projects.component';
import { SubordinatesListComponent } from './components/subordinates-list/subordinates-list.component';
import { ProjectInfoComponent } from './components/project-info/project-info.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AvatarUploadComponent,
    UserInfoComponent,
    UserProjectsComponent,
    SubordinatesListComponent,
    ProjectInfoComponent,
  ],
  imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
