import { NgModule } from '@angular/core';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { FormsModule } from '@angular/forms';
import { ProjectsFilteringFormComponent } from './components/projects-filtering-form/projects-filtering-form.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as gantt from 'highcharts/modules/gantt.src';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';

@NgModule({
  declarations: [ProjectsComponent, AddProjectComponent, ProjectsListComponent, SingleProjectComponent, ProjectsFilteringFormComponent],
  imports: [
    ProjectsRoutingModule,
    SharedModule,
    FormsModule,
    ChartModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [gantt, more, exporting] }
  ],
})
export class ProjectsModule { }
