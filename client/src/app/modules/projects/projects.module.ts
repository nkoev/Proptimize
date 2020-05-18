import { NgModule } from '@angular/core';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProjectsComponent, AddProjectComponent, ProjectsListComponent, SingleProjectComponent],
  imports: [
    ProjectsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ProjectsModule { }
