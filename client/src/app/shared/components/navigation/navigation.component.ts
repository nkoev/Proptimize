import { Component, OnInit, Input } from '@angular/core';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { AuthService } from 'src/app/modules/core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Input() loggedUser: UserDTO;
  constructor() {}

  ngOnInit(): void {}
}
