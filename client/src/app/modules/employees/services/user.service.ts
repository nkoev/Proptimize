import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { UserDTO } from 'src/app/models/user.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentData } from '@google-cloud/firestore';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCol: AngularFirestoreCollection;
  allUsers$: Observable<DocumentData[]>;

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.usersCol = this.afs.collection<UserDTO>('users');
    this.allUsers$ = this.usersCol
      .snapshotChanges()
      .pipe(map((changes) => changes.map((change) => change.payload.doc)));
  }

  async getAllUsers() {
    return await this.usersCol.ref.get();
  }

  async getUserById(userId: string) {
    return await this.usersCol.doc(userId).ref.get();
  }

  registerUser(user: UserDTO): Observable<any> {
    return this.http
      .post<DocumentData>(
        'https://europe-west1-proptimize-edb90.cloudfunctions.net/register',
        {
          email: user.email,
          pass: '123456',
        }
      )
      .pipe(
        tap((res) => this.usersCol.doc(res.uid).set({ ...user, uid: res.uid }))
      );
  }
}
