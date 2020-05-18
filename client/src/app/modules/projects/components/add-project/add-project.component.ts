import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectService.addProject({
      name: 'aloha',
      description: 'random',
      targetInDays: 3
    });
  }

}
