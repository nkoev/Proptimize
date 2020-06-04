import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  today = new Date();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
