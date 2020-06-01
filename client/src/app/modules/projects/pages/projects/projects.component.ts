import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { DocumentData } from '@angular/fire/firestore/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../../components/add-project/add-project.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { SkillService } from 'src/app/modules/skills/skill.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  isLeftVisible = true;
  today = new Date();
  projectsData: ProjectDTO[];
  projects$: BehaviorSubject<ProjectDTO[]> = new BehaviorSubject([]);
  projects: Observable<ProjectDTO[]> = this.projects$.asObservable();
  singleProject: ProjectDTO;
  loggedUser: DocumentData;
  private subscriptions: Subscription[] = [];
  skillsList: string[] = [];
  employeesListData$ = new BehaviorSubject([]);
  employeesList = this.employeesListData$.asObservable();
  statusList = ['In Progress', 'Closed'];

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private skillService: SkillService,
    private auth: AuthService,
    private matDialog: MatDialog,
    private router: Router,
    private readonly route: ActivatedRoute
  ) {}

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
          this.togglePanes(false);
        }
      });
    });

    const sub3 = this.route.data.subscribe(
      (data) => (this.loggedUser = data.loggedUser)
    );
    const sub4 = this.auth.loggedUser$.subscribe(
      (res) => (this.loggedUser = res.data())
    );

    const sub5 = this.employeeService.$allEmployees.subscribe((employees) => {
      this.employeesListData$.next(employees);
    });

    const sub6 = this.skillService
      .getSkills()
      .subscribe((res: any) => (this.skillsList = res));

    this.subscriptions.push(sub1, sub3, sub4, sub5, sub6);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  filterProjects(event: any) {
    let filteredProjects = this.projectsData;

    if (event.skills?.length) {
      filteredProjects = filteredProjects.filter((project) =>
        project.skills?.some((skill) => event.skills.includes(skill))
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
      filteredProjects = filteredProjects.filter(
        (project) => project.reporter?.id === this.loggedUser.uid
      );
    }

    this.projects$.next(filteredProjects);
  }

  addProject() {
    if (this.loggedUser.availableHours < 1) {
      window.alert(
        "You can't start a project, because you are already working 8h/day"
      );
      return;
    }

    const dialogData: any = {
      skillsList: this.skillsList,
      employeesList: this.employeesList,
      loggedUser: this.loggedUser,
      currentProject: {},
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

  updateProject() {
    if (this.loggedUser.uid !== this.singleProject.reporter.id) {
      window.alert("You can't update other users' projects");
      return;
    }

    const dialogData: any = {
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

  closeProject() {
    this.projectService.closeProject(this.singleProject, this.loggedUser);
  }

  togglePanes(event: boolean) {
    this.isLeftVisible = event;
    event
      ? this.router.navigate(['/' + 'projects'])
      : this.router.navigate(['/' + 'projects'], {
          queryParams: { id: this.singleProject.id },
        });
  }

  getSingleProject(project: any) {
    this.singleProject = project;
  }
}
