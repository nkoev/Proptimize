import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Input() loggedUser: UserDTO;
  @Output() toLeftPane = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
