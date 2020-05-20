import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import * as _ from "lodash";
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { DocumentData } from '@angular/fire/firestore/interfaces';

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
  loggedUser: DocumentData;
  private subscriptions: Subscription[] = [];

  skillsList = [
    'hakuna',
    'matata',
    'bira',
    'shisha'
  ];
  statusList = [
    'In Progress',
    'Closed',
  ];

  constructor(
    private projectService: ProjectService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    const sub1 = this.projectService.getAll().subscribe(data => {
      console.log(data);
      this.projectsData = data;
      this.projects$.next(data);
    });

    const sub2 = this.auth.loggedUser$.subscribe(
      (res) => (this.loggedUser = res)
    );

    this.subscriptions.push(sub1, sub2);
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
          project.reporter?.firstName.toLowerCase().includes(event.reporter.toLowerCase())
          || project.reporter?.lastName.toLowerCase().includes(event.reporter.toLowerCase())
        ) { return true }
        else { return false }
      });
    }
    if (event.myProjects) {
      filteredProjects = filteredProjects.filter((project) =>
        project.reporter?.id === this.loggedUser.uid
      );
    }

    this.projects$.next(filteredProjects);
  }

  addProject() {
    this.projectService.addProject({ name: 'Project #1', description: 'This should be a description', targetInDays: 5 });
  }

  togglePanes(event: any) {
    this.isLeftVisible = event;
  }
}
