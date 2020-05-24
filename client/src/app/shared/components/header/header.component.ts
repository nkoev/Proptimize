import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  initials: string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.loggedUser$.subscribe((res) => {
      if (res) {
        this.initials = res.firstName[0].toUpperCase();
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
