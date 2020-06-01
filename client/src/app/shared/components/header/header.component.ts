import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() loggedUser: UserDTO;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.auth
      .logout()
      .then(() => {
        console.log('logged out');
        this.router.navigate(['login']);
      })
      .catch(() => console.log('logout failed'));
  }
}
