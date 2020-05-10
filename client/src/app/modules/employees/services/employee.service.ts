import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { EmployeeDTO } from 'src/app/models/employee.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeesCol: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    this.employeesCol = this.afs.collection<EmployeeDTO>('employees');
  }

  addEmployee(employee: EmployeeDTO): Promise<any> {
    return this.employeesCol.add(employee);
  }
}
