import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import {
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore/public_api';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { EmployeeCreateDTO } from 'src/app/models/employees/employee-create.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeesCol: AngularFirestoreCollection<EmployeeDTO | EmployeeCreateDTO>;

  constructor(private afs: AngularFirestore) {
    this.employeesCol = this.afs.collection<EmployeeDTO>('employees');
  }

  allEmployees(): Observable<EmployeeDTO[]> {
    return this.employeesCol.valueChanges({ idField: 'id' });
  }

  async queryEmployees(field: string, value: string): Promise<EmployeeDTO[]> {
    const snapshot = await this.employeesCol.ref
      .where(field, '==', value)
      .get();
    return snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as EmployeeDTO;
    });
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeDTO> {
    const doc = await this.employeesCol.doc(employeeId).ref.get();
    return { ...doc.data(), id: doc.id } as EmployeeDTO;
  }

  async addEmployee(employee: EmployeeCreateDTO): Promise<DocumentReference> {
    return await this.employeesCol.add(employee);
  }

  async addSkillsToEmployee(
    skills: string[],
    employeeId: string
  ): Promise<void> {
    return await this.employeesCol
      .doc(employeeId)
      .update({ skills: firestore.FieldValue.arrayUnion(...skills) });
  }

  addProject(employeeId: string, project: any) {
    const sum = project.dailyInput.reduce((acc, e) => {
      acc += e.hours;
      return acc;
    }, 0);
    const employeeRef = this.employeesCol.doc(employeeId);
    employeeRef.update({
      availableHours: firebase.firestore.FieldValue.increment(-sum),
      projects: firebase.firestore.FieldValue.arrayUnion(project),
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
      projects: firebase.firestore.FieldValue.arrayRemove(project),
    });
  }
}
