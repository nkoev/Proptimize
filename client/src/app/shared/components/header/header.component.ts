import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  avatarUrl: string;
  initials: string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.loggedUser$.subscribe((res) => {
      if (res) {
        this.initials = res.firstName[0].toUpperCase();
        this.avatarUrl = res.avatarUrl;
      }
    });
  }

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
