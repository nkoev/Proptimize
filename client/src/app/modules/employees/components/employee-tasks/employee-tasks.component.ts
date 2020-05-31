import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentData } from '@google-cloud/firestore';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.css'],
})
export class EmployeeTasksComponent implements OnInit {
  inputs: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: { employeeInput: any[] }
  ) {
    this.inputs = data.employeeInput;
  }

  ngOnInit(): void {}
}
