import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentData } from '@google-cloud/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeesCol: AngularFirestoreCollection;
  $allEmployees: Observable<DocumentData[]>;

  constructor(private afs: AngularFirestore) {
    this.employeesCol = this.afs.collection<EmployeeDTO>('employees');
    this.$allEmployees = this.employeesCol.snapshotChanges().pipe(
      map((changes) =>
        changes.map((change) => {
          return { ...change.payload.doc.data(), id: change.payload.doc.id };
        })
      )
    );
  }

  async getAllEmployees() {
    return await this.employeesCol.ref.get();
  }

  async getEmployeeById(employeeId: string) {
    return await this.employeesCol.doc(employeeId).ref.get();
  }

  addProject(employeeId: string, project: any) {
    const sum = project.dailyInput.reduce((acc, e) => {
      acc += e.hours;
      return acc;
    }, 0);
    const employeeRef = this.employeesCol.doc(employeeId);
    employeeRef.update({
      availableHours: firebase.firestore.FieldValue.increment(-sum),
      projects: firebase.firestore.FieldValue.arrayUnion(project)
    });
  }

  removeProject(employeeId: string, project: any) {
    const sum = project.dailyInput.reduce((acc, e) => {
      acc += e.hours;
      return acc;
    }, 0);
    const employeeRef = this.employeesCol.doc(employeeId);
    employeeRef.update({
      availableHours: firebase.firestore.FieldValue.increment(sum),
      projects: firebase.firestore.FieldValue.arrayRemove(project)
    });
  }

  async addEmployee(employee: EmployeeDTO) {
    return await this.employeesCol.add(employee);
  }

  async addSkillsToEmployee(skills: string[], employeeId: string) {
    return await this.employeesCol
      .doc(employeeId)
      .update({ skills: firestore.FieldValue.arrayUnion(...skills) });
  }
}
