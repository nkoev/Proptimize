import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { CoreModule } from '../core.module';

@Injectable({
  providedIn: CoreModule,
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notificator: NotificationService
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.loggedUser$.pipe(
      map((loggedUser) => loggedUser.isAdmin),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigate(['dashboard']);
          this.notificator.warn('Unauthorized');
        }
      })
    );
  }
}
