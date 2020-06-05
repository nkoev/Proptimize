import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule,
})
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isLoggedIn$.pipe(
      map((loggedIn) => !loggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['dashboard']);
        }
      })
    );
  }
}
