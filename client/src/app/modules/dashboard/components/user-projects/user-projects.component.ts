import { Component, OnInit, Input } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css'],
})
export class UserProjectsComponent implements OnInit {
  @Input() loggedUser: UserDTO;
  constructor() {}

  ngOnInit(): void {}
}
