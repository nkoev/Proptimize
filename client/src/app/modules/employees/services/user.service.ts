import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { UserDTO } from 'src/app/models/user.dto';
import { Credentials } from 'src/app/models/credentials';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentData } from '@google-cloud/firestore';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCol: AngularFirestoreCollection;
  private username: string;
  private password: string;
  allUsers$: Observable<DocumentData[]>;

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.usersCol = this.afs.collection<UserDTO>('users');
    this.allUsers$ = this.usersCol.snapshotChanges();
  }

  async getUserById(userId: string): Promise<any> {
    return await this.usersCol.doc(userId).ref.get();
  }

  registerUser(user: UserDTO): Observable<Credentials> {
    this.username = this.createUsername(user.firstName);
    this.password = this.createPassword();
    return this.http
      .post<DocumentData>(
        'https://europe-west1-proptimize-edb90.cloudfunctions.net/register',
        {
          email: `${this.username}@proptimize.com`,
          pass: this.password,
        }
      )
      .pipe(
        tap((res) => this.usersCol.doc(res.uid).set(user)),
        map(() => {
          return { username: this.username, password: this.password };
        })
      );
  }

  private createUsername(name: string): string {
    return name + Math.round(Math.random() * (9999 - 1000) + 1000).toString();
  }
  private createPassword(): string {
    return Math.round(Math.random() * (999999 - 100000) + 100000).toString();
  }
}
