import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule,
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notificator: NotificationService
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.isLoggedIn$.pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['login']);
          this.notificator.warn('Please login first');
        }
      })
    );
  }
}
