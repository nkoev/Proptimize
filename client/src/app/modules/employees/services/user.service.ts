import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { UserDTO } from 'src/app/models/user.dto';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersCol: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.usersCol = this.afs.collection<UserDTO>('users');
  }

  async addUser(user: UserDTO): Promise<any> {
    const username = this.createUsername(user.firstName);
    const password = this.createPassword();

    const cred = await this.afAuth.createUserWithEmailAndPassword(
      `${username}@proptimize`,
      password
    );
    await this.usersCol.doc(cred.user.uid).set(user);
    return { username, password };
  }

  private createUsername(name: string): string {
    return name + Math.round(Math.random() * (9999 - 1000) + 1000).toString();
  }
  private createPassword(): string {
    return Math.round(Math.random() * (999999 - 100000) + 100000).toString();
  }
}
