import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit {
  today = new Date();

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  addEmployee() {
    this.matDialog.open(AddEmployeeComponent);
  }
}
