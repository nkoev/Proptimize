import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { UserDTO } from 'src/app/models/user.dto';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Credentials } from 'src/app/models/credentials';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCol: AngularFirestoreCollection;
  allUsers$;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.usersCol = this.afs.collection<UserDTO>('users');
    this.allUsers$ = this.usersCol.snapshotChanges();
  }

  async addUser(user: UserDTO): Promise<Credentials> {
    const username = this.createUsername(user.firstName);
    const password = this.createPassword();

    const cred = await this.afAuth.createUserWithEmailAndPassword(
      `${username}@proptimize.com`,
      password
    );
    if (user.managedBy !== 'Self-managed') {
      await this.addInSubordinates(user);
    }
    await this.usersCol.doc(cred.user.uid).set(user);
    return { username, password };
  }

  async getUserById(userId: string) {
    return await this.usersCol.doc(userId).ref.get();
  }

  private async addInSubordinates(user) {
    const managerDoc = this.usersCol.doc(user.managedBy.id).ref;
    const currentSubs = (await managerDoc.get()).data().subordinates;
    const subordinates = [...currentSubs, user.firstName];
    managerDoc.set({ subordinates }, { merge: true });
  }

  private createUsername(name: string): string {
    return name + Math.round(Math.random() * (9999 - 1000) + 1000).toString();
  }
  private createPassword(): string {
    return Math.round(Math.random() * (999999 - 100000) + 100000).toString();
  }
}
