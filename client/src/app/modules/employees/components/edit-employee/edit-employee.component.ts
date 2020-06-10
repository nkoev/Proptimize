import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { NotificationService } from 'src/app/modules/core/services/notification.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  skills: FormControl = new FormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { skillsList: string[]; employee: EmployeeDTO },
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<EditEmployeeComponent>,
    private notificator: NotificationService
  ) {}

  ngOnInit(): void {}

  get skillsList(): string[] {
    return this.data.skillsList.filter(
      (skill) => !this.employee.skills.includes(skill)
    );
  }

  get employee(): EmployeeDTO {
    return this.data.employee;
  }

  addSkills(skills: string[]): void {
    this.skills.invalid
      ? this.notificator.warn('Please, select a skill')
      : (this.employeeService.addSkillsToEmployee(skills, this.employee.id),
        this.skills.reset());
  }
}
