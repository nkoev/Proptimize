import { Component, OnInit, Input } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/modules/projects/services/project.service';
import { GanttService } from 'src/app/modules/projects/services/gantt.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectInfoComponent } from '../project-info/project-info.component';
import { DataFormatterService } from 'src/app/modules/projects/services/data-formatter.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css'],
})
export class UserProjectsComponent implements OnInit {
  @Input() loggedUser: UserDTO;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private readonly dataFormatterService: DataFormatterService,
    private gantt: GanttService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void { }

  async expandProject(project: any): Promise<void> {
    let startDate: Date;
    let endDate: Date;
    let skills: {
      skill: string;
      startDate: Date;
      endDate: Date;
      completeness: { amount: number; fill: boolean };
    }[];
    const projectData = await this.projectService.getProjectById(project.id);
    ({ startDate, endDate, skills } = this.dataFormatterService.projectToChartData(
      projectData.data() as ProjectDTO
    ));
    this.matDialog.open(ProjectInfoComponent, {
      data: { name: project.name, startDate, endDate, skills },
    });
  }

  goToProject(projectId: string): void {
    this.router.navigate(['/projects'], { queryParams: { id: projectId } });
  }
}
