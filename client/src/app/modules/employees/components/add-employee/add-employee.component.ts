import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { UserService } from '../../services/user.service';
import { UserCreateDTO } from 'src/app/models/employees/user-create.dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../core/services/notification.service';
import { EmployeeCreateDTO } from 'src/app/models/employees/employee-create.dto';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  skillsList: string[];
  managersList: UserDTO[];
  employeeForm: FormGroup;
  inProgress = false;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private userService: UserService,
    private notificator: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    private data: { skillsList: string[]; managers: UserDTO[] },
    public dialogRef: MatDialogRef<AddEmployeeComponent>
  ) {
    this.skillsList = this.data.skillsList;
    this.managersList = this.data.managers;
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z][a-zA-Z\\- ]*'),
        ],
      ],
      lastName: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z][a-zA-Z\\- ]*'),
        ],
      ],
      position: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z][a-zA-Z\\- ]*'),
        ],
      ],
      managedBy: [null, Validators.required],
      isManager: false,
      isAdmin: false,
      skills: [null, Validators.required],
      email: null,
    });
    this.setIsManagerValidators();
    const sub1 = this.firstName.valueChanges.subscribe(() => {
      this.titleCase(this.firstName);
    });
    const sub2 = this.lastName.valueChanges.subscribe(() => {
      this.titleCase(this.lastName);
    });
    const sub3 = this.position.valueChanges.subscribe(() => {
      this.titleCase(this.position);
    });
    this.subscriptions.push(sub1, sub2, sub3);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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

  onSubmit(form: FormGroup): void {
    form.invalid
      ? this.notifyErrors()
      : form.value.isManager
      ? this.registerUser(form)
      : this.addEmployee(form);
  }

  private notifyErrors(): void {
    const controls = this.employeeForm.controls;
    for (const controlName in controls) {
      if (controls[controlName].errors?.required) {
        this.notificator.warn('Please, fill in all the required fields.');
        break;
      }
    }
    for (const controlName in controls) {
      if (controls[controlName].errors?.pattern) {
        this.notificator.warn('Latin letters and "-" allowed only.');
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

  private addEmployee(form: FormGroup): void {
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

  private registerUser(form: FormGroup): void {
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

  private toEmployeeDTO(form: FormGroup): EmployeeCreateDTO {
    const employee: EmployeeCreateDTO = {
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      position: form.value.position.trim(),
      skills: form.value.skills,
      availableHours: 8,
      projects: [],
      managedBy:
        form.value.managedBy === 'self-managed'
          ? null
          : {
              id: form.value.managedBy.id,
              firstName: form.value.managedBy.firstName,
              lastName: form.value.managedBy.lastName,
            },
    };
    return employee;
  }

  private toUserDTO(form: FormGroup): UserCreateDTO {
    const user: UserCreateDTO = {
      email: form.value.email,
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      position: form.value.position.trim(),
      isAdmin: form.value.isAdmin,
      availableHours: 8,
      projects: [],
      managedBy:
        form.value.managedBy === 'self-managed'
          ? null
          : {
              id: form.value.managedBy.id,
              firstName: form.value.managedBy.firstName,
              lastName: form.value.managedBy.lastName,
            },
    };
    return user;
  }

  private setIsManagerValidators(): void {
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

  private titleCase(control: AbstractControl) {
    control.patchValue(
      control.value.charAt(0).toUpperCase() + control.value.slice(1),
      { emitEvent: false }
    );
  }
}
