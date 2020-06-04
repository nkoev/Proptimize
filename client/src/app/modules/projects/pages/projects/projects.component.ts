import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ViewChild,
} from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { DocumentData } from '@angular/fire/firestore/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent, ProjectDialogData } from '../../components/add-project/add-project.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { SkillService } from 'src/app/modules/skills/skill.service';
import { SingleProjectComponent } from '../../components/single-project/single-project.component';
import { NotificationService } from 'src/app/modules/core/services/notification.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild(SingleProjectComponent) private singleProjectComponent: SingleProjectComponent;
  isLeftVisible = true;

  projects$: BehaviorSubject<ProjectDTO[]> = new BehaviorSubject([]);
  projects: Observable<ProjectDTO[]> = this.projects$.asObservable();
  projectsData: ProjectDTO[];
  singleProject: ProjectDTO;
  employeesListData$ = new BehaviorSubject([]);
  employeesList = this.employeesListData$.asObservable();
  loggedUser: DocumentData;
  skillsList: string[] = [];
  private subscriptions: Subscription[] = [];
  today = new Date();

  constructor(
    private readonly auth: AuthService,
    private readonly employeeService: EmployeeService,
    private readonly projectService: ProjectService,
    private readonly skillService: SkillService,
    private readonly notificationService: NotificationService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const sub1 = this.projectService.getAll().subscribe((data) => {
      console.log(data);
      this.projectsData = data;
      this.projects$.next(data);

      const sub2 = this.route.queryParams.subscribe((params) => {
        const projectId = params['id'];
        if (projectId && this.projectsData) {
          this.singleProject = this.projects$
            .getValue()
            .filter((p) => p.id === projectId)[0];
          // console.log(this.singleProject);
          this.singleProjectComponent.loadChart();
          this.togglePanes(false);
        }
      });

      this.subscriptions.push(sub2);
    });

    const sub3 = this.route.data.subscribe(data => (this.loggedUser = data.loggedUser));
    const sub4 = this.auth.loggedUser$.subscribe(res => (this.loggedUser = res));
    const sub5 = this.employeeService.$allEmployees.subscribe(employees => {
      this.employeesListData$.next(employees);
    });
    const sub6 = this.skillService.getSkills().subscribe(res => (this.skillsList = res));

    this.subscriptions.push(sub1, sub3, sub4, sub5, sub6);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  filterProjects(event: {
    skills: string[],
    status: string[],
    name: string,
    reporter: string,
    myProjects: boolean
  }): void {
    let filteredProjects = this.projectsData;

    if (event.skills?.length) {
      filteredProjects = filteredProjects.filter((project) =>
        project.skills?.some((skill) => event.skills.includes(skill.name))
      );
    }
    if (event.status?.length) {
      filteredProjects = filteredProjects.filter((project) =>
        event.status.includes(project.status)
      );
    }
    if (event.name) {
      filteredProjects = filteredProjects.filter((project) =>
        project.name?.toLowerCase().includes(event.name.toLowerCase())
      );
    }
    if (event.reporter) {
      filteredProjects = filteredProjects.filter((project) => {
        if (
          project.reporter?.firstName
            .toLowerCase()
            .includes(event.reporter.toLowerCase()) ||
          project.reporter?.lastName
            .toLowerCase()
            .includes(event.reporter.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (event.myProjects) {
      filteredProjects = filteredProjects.filter((project) =>
        project.reporter?.id === this.loggedUser.uid
      );
    }

    this.projects$.next(filteredProjects);
  }

  addProject(): void {
    if (this.loggedUser.availableHours < 1) {
      this.notificationService.error(
        "You can't start a project, because you are already working 8h/day"
      );
      return;
    }

    const dialogData: ProjectDialogData = {
      skillsList: this.skillsList,
      employeesList: this.employeesList,
      loggedUser: this.loggedUser,
      currentProject: {} as ProjectDTO,
    };

    AddProjectComponent.openProjectDialog(this.matDialog, dialogData).subscribe(
      (result) => {
        if (result) {
          const projectData = this.projectService.formToProjectData(result);
          this.projectService.addProject(projectData, this.loggedUser);
        }
      }
    );
  }

  updateProject(): void {
    if (this.loggedUser.uid !== this.singleProject.reporter.id) {
      this.notificationService.error("You can't update other users' projects");
      return;
    }

    const dialogData: ProjectDialogData = {
      skillsList: this.skillsList,
      employeesList: this.employeesList,
      loggedUser: this.loggedUser,
      currentProject: this.singleProject,
    };

    AddProjectComponent.openProjectDialog(this.matDialog, dialogData).subscribe(
      (result) => {
        if (result) {
          const projectData = this.projectService.formToProjectData(
            result,
            this.singleProject
          );
          this.projectService.updateProject(
            projectData,
            this.loggedUser,
            this.singleProject
          );
        }
      }
    );
  }

  closeProject(): void {
    this.projectService.closeProject(this.singleProject, this.loggedUser);
  }

  togglePanes(event: boolean): void {
    this.isLeftVisible = event;
    event
      ? this.router.navigate(['/' + 'projects'])
      : this.router.navigate(['/' + 'projects'], {
        queryParams: { id: this.singleProject.id },
      });
  }

  getSingleProject(project: ProjectDTO): void {
    this.singleProject = project;
    this.singleProjectComponent.loadChart();
  }
}
