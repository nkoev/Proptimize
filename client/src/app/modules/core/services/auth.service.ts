import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: CoreModule,
})
export class AuthService {
  loggedUser$ = this.afAuth.authState;

  constructor(private afAuth: AngularFireAuth) {}

  async login(username: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(
      `${username}@proptimize.com`,
      password
    );
  }

  async logout() {
    return await this.afAuth.signOut();
  }
}
