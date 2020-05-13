import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employee.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from 'src/app/models/user.dto';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CredentialsMemoComponent } from '../credentials-memo/credentials-memo.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  skillsList = ['Java', 'JavaScript', 'BellyDancing'];
  managersList = ['Boncho', 'Concho', 'Paraponcho'];
  username: string;
  password: string;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(20)]],
      lastName: [null, [Validators.required, Validators.maxLength(20)]],
      position: [null, [Validators.required, Validators.maxLength(20)]],
      managedBy: [null, Validators.required],
      isManager: false,
      isAdmin: false,
      skills: [null, Validators.required],
    });
    this.setIsManagerValidators();
  }

  get firstName() {
    return this.employeeForm.get('firstName');
  }
  get lastName() {
    return this.employeeForm.get('lastName');
  }
  get position() {
    return this.employeeForm.get('position');
  }
  get isManager() {
    return this.employeeForm.get('isManager');
  }
  get isAdmin() {
    return this.employeeForm.get('isAdmin');
  }
  get managedBy() {
    return this.employeeForm.get('managedBy');
  }
  get skills() {
    return this.employeeForm.get('skills');
  }

  async onSubmit(form: FormGroup) {
    form.invalid
      ? console.log('Invalid Form')
      : form.value.isManager
      ? await this.userService
          .addUser(this.toUserDTO(form))
          .then((res) => {
            this.matDialog.open(CredentialsMemoComponent, {
              data: { username: res.username, password: res.password },
            });
            this.dialogRef.close();
          })
          .catch((err) => console.log(err.message))
      : await this.employeeService
          .addEmployee(this.toEmployeeDTO(form))
          .then(() => this.dialogRef.close())
          .catch((err) => console.log(err.message));
  }

  private toEmployeeDTO(form: FormGroup): EmployeeDTO {
    const employee: EmployeeDTO = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      position: form.value.position,
      managedBy: form.value.managedBy,
      skills: form.value.skills,
      availableHours: 8,
      projects: [],
    };
    return employee;
  }

  private toUserDTO(form: FormGroup): UserDTO {
    const user: UserDTO = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      position: form.value.position,
      isAdmin: form.value.isAdmin,
      subordinates: [],
      availableHours: 8,
      projects: [],
    };
    return user;
  }

  private setIsManagerValidators() {
    const managedByControl = this.employeeForm.get('managedBy');
    const skillsControl = this.employeeForm.get('skills');

    this.employeeForm.get('isManager').valueChanges.subscribe((isManager) => {
      if (isManager) {
        // managedByControl.setValidators(null);
        // managedByControl.disable();
        skillsControl.setValidators(null);
        skillsControl.disable();
      }

      if (!isManager) {
        // managedByControl.setValidators([Validators.required]);
        // managedByControl.enable();
        skillsControl.setValidators([Validators.required]);
        skillsControl.enable();
      }

      managedByControl.updateValueAndValidity();
      skillsControl.updateValueAndValidity();
    });
  }
}
