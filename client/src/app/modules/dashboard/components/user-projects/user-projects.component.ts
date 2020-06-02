import { Component, OnInit, Input } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css'],
})
export class UserProjectsComponent implements OnInit {
  @Input() loggedUser: UserDTO;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  expandProject(project: any) {}

  goToProject(projectId: string) {
    this.router.navigate(['/projects'], { queryParams: { id: projectId } });
  }
}
