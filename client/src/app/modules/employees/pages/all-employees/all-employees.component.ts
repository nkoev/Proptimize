import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employee.dto';
import { DocumentData } from '@angular/fire/firestore/interfaces';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit {
  today = new Date();
  employees: DocumentData[];

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService
      .getAllEmployees()
      .subscribe(
        (changes) =>
          (this.employees = changes.map((change) => change.payload.doc.data()))
      );
  }

  addEmployee() {
    this.matDialog.open(AddEmployeeComponent);
  }
}
