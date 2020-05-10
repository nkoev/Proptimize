import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { UserDTO } from 'src/app/models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersCol: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    this.usersCol = this.afs.collection<UserDTO>('users');
  }

  addUser(user: UserDTO): Promise<any> {
    return this.usersCol.add(user);
  }
}
