import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: CoreModule,
})
export class AuthService {
  isLoggedIn$: Observable<boolean> = this.afAuth.authState.pipe(
    map((loggedUser) => (loggedUser ? true : false))
  );
  private readonly loggedUserSubject$ = new BehaviorSubject<UserDTO>(null);

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.authState
      .pipe(
        switchMap((user) => {
          if (user) {
            return this.afs.doc<UserDTO>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      )
      .subscribe((res) => this.loggedUserSubject$.next(res));
  }

  public get loggedUser$(): Observable<UserDTO> {
    return this.loggedUserSubject$.asObservable();
  }

  async login(username: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(username, password);
  }

  async logout() {
    return await this.afAuth.signOut();
  }
}
