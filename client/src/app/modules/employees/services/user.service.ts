import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentData } from '@google-cloud/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { UserCreateDTO } from 'src/app/models/employees/user-create.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCol: AngularFirestoreCollection<UserDTO>;
  allUsers$: Observable<UserDTO[]>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.usersCol = this.afs.collection<UserDTO>('users');
    this.allUsers$ = this.usersCol.snapshotChanges().pipe(
      map((changes) =>
        changes.map((change) => {
          return {
            ...change.payload.doc.data(),
            id: change.payload.doc.id,
          } as UserDTO;
        })
      )
    );
  }

  async queryUsers(field: string, value: string): Promise<UserDTO[]> {
    const snapshot = await this.usersCol.ref.where(field, '==', value).get();
    return snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as UserDTO;
    });
  }

  async getUserById(userId: string): Promise<UserDTO> {
    const doc = await this.usersCol.doc(userId).ref.get();
    return { ...doc.data(), id: doc.id } as UserDTO;
  }

  async updateUser(userId: string, data: Partial<UserDTO>): Promise<void> {
    return await this.usersCol.doc(userId).update(data);
  }

  registerUser(user: UserCreateDTO): Observable<void> {
    return this.http
      .post<DocumentData>(
        'https://europe-west1-proptimize-edb90.cloudfunctions.net/register',
        {
          email: user.email,
          pass: '123456',
        }
      )
      .pipe(
        tap((res) => this.afAuth.sendPasswordResetEmail(res.email)),
        switchMap((res) =>
          this.usersCol.doc(res.uid).set({ ...user, id: res.uid })
        )
      );
  }

  addProject(userId: string, project: any) {
    const employeeRef = this.usersCol.doc(userId);
    employeeRef.update({
      availableHours: firebase.firestore.FieldValue.increment(
        -project.dailyInput[0].hours
      ),
      projects: firebase.firestore.FieldValue.arrayUnion(project),
    });
  }

  removeProject(userId: string, project: any) {
    const employeeRef = this.usersCol.doc(userId);
    employeeRef.update({
      availableHours: firebase.firestore.FieldValue.increment(
        project.dailyInput[0].hours
      ),
      projects: firebase.firestore.FieldValue.arrayRemove(project),
    });
  }
}
