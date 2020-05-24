import { Component, OnInit } from '@angular/core';
import { UserDTO } from 'src/app/models/user.dto';
import { AuthService } from 'src/app/modules/core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  loggedUser: UserDTO;
  constructor(private auth: AuthService) {
    this.auth.loggedUser$.subscribe((res) => (this.loggedUser = res));
  }

  ngOnInit(): void {}
}
