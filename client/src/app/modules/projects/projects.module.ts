import { NgModule } from '@angular/core';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule { }
