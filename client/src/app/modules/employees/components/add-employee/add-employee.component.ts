import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentReference, DocumentData } from '@google-cloud/firestore';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  skillsList: string[];
  managersList: DocumentData[];
  employeeForm: FormGroup;
  inProgress = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private userService: UserService,
    private notificator: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    private data: { skillsList: string[]; managers: DocumentReference[] },
    public dialogRef: MatDialogRef<AddEmployeeComponent>
  ) {
    this.skillsList = this.data.skillsList;
    this.managersList = this.data.managers;
  }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(20)]],
      lastName: [null, [Validators.required, Validators.maxLength(20)]],
      position: [null, [Validators.required, Validators.maxLength(20)]],
      managedBy: [null, Validators.required],
      isManager: false,
      isAdmin: false,
      skills: [null, Validators.required],
      email: null,
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
  get email() {
    return this.employeeForm.get('email');
  }

  onSubmit(form: FormGroup) {
    form.invalid
      ? this.notifyErrors()
      : form.value.isManager
      ? this.registerUser(form)
      : this.addEmployee(form);
  }

  private notifyErrors() {
    const controls = this.employeeForm.controls;
    for (const controlName in controls) {
      if (controls[controlName].errors?.required) {
        this.notificator.warn(' Please, fill in all the required fields.');
        break;
      }
    }
    if (this.email.errors?.email) {
      this.notificator.warn(' Please, provide valid email address.');
    }
    if (this.firstName.errors?.maxlength) {
      this.notificator.warn('First Name should not exceed 20 characters');
    }
    if (this.lastName.errors?.maxlength) {
      this.notificator.warn('Last Name should not exceed 20 characters');
    }
    if (this.position.errors?.maxlength) {
      this.notificator.warn('Position should not exceed 20 characters');
    }
  }

  private addEmployee(form: FormGroup) {
    this.employeeService
      .addEmployee(this.toEmployeeDTO(form))
      .then(() => {
        this.dialogRef.close();
        this.notificator.success('Employee added successfully!');
      })
      .catch((err) => {
        this.notificator.error('Add employee failed.');
        console.log(err.message);
      });
  }

  private registerUser(form: FormGroup) {
    this.inProgress = true;
    this.userService.registerUser(this.toUserDTO(form)).subscribe(
      () => {
        this.dialogRef.close();
        this.notificator.success(
          'Successful registration!. Password reset email was sent.'
        );
      },
      (err) => {
        this.inProgress = false;
        this.notificator.error('Registration failed.');
        console.log(err.message);
      }
    );
  }

  private toEmployeeDTO(form: FormGroup): EmployeeDTO {
    const employee: EmployeeDTO = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      position: form.value.position,
      skills: form.value.skills,
      availableHours: 8,
      projects: [],
      managedBy:
        form.value.managedBy === 'self-managed'
          ? null
          : form.value.managedBy.id,
    };
    return employee;
  }

  private toUserDTO(form: FormGroup): UserDTO {
    const user: UserDTO = {
      uid: undefined,
      email: form.value.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      position: form.value.position,
      isAdmin: form.value.isAdmin,
      availableHours: 8,
      projects: [],
      managedBy:
        form.value.managedBy === 'self-managed'
          ? null
          : form.value.managedBy.id,
    };
    return user;
  }

  private setIsManagerValidators() {
    const emailControl = this.employeeForm.get('email');
    const skillsControl = this.employeeForm.get('skills');

    this.employeeForm.get('isManager').valueChanges.subscribe((isManager) => {
      if (isManager) {
        skillsControl.setValidators(null);
        emailControl.setValidators([Validators.required, Validators.email]);
      }

      if (!isManager) {
        skillsControl.setValidators([Validators.required]);
        emailControl.setValidators(null);
      }

      emailControl.updateValueAndValidity();
      skillsControl.updateValueAndValidity();
    });
  }
}
