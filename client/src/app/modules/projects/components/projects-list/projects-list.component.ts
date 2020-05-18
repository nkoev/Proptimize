import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { Observable } from 'rxjs';
import * as _ from "lodash";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {

  @Input() projects: Observable<ProjectDTO[]>;
  // @Input() finished: boolean;
  // @Output() updateProjects = new EventEmitter<any>();

  selector = '.projects-container';
  lastKeypress = 0;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    // this.projects.subscribe(data => console.log(data));
  }

  onScroll() {
    console.log('scrolled');
  }
}
