import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentData } from '@google-cloud/firestore';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  skills: FormControl = new FormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { skillsList: string[]; employee: DocumentData },
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<EditEmployeeComponent>
  ) {}

  ngOnInit(): void {}

  get skillsList() {
    return this.data.skillsList.filter(
      (skill) => !this.employee.skills.includes(skill)
    );
  }

  get employee() {
    return this.data.employee;
  }

  addSkills(skills: string[]) {
    this.employeeService.addSkillsToEmployee(skills, this.employee.id);
  }
}
