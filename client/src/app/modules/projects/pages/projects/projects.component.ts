import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import * as _ from "lodash";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {

  isLeftVisible = true;
  today = new Date();
  projects$: BehaviorSubject<ProjectDTO[]> = new BehaviorSubject([]);
  projects = this.projects$.asObservable();

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectService.getAll().subscribe(data => {
      console.log(data);
      this.projects$.next(data);
    });
  }
}
