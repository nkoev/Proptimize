import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
})
export class ProjectsListComponent implements OnInit {
  @Input() projects: Observable<ProjectDTO[]>;
  @Output() selectProjectEvent = new EventEmitter<ProjectDTO>();

  selector = '.projects-container';
  lastKeypress = 0;

  constructor() {}

  ngOnInit(): void {}

  onProjectSelect(idx: number) {
    let selectedProject: ProjectDTO;
    this.projects.subscribe((data) => (selectedProject = data[idx]));
    this.selectProjectEvent.emit(selectedProject);
  }

  // onScroll() {
  //   console.log('scrolled');
  // }
}
