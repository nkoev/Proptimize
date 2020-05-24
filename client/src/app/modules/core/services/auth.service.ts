import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDTO } from 'src/app/models/user.dto';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: CoreModule,
})
export class AuthService {
  loggedUser$: Observable<UserDTO>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.loggedUser$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<UserDTO>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async login(username: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(username, password);
  }

  async logout() {
    return await this.afAuth.signOut();
  }
}
