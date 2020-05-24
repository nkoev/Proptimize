import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employee.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from 'src/app/models/user.dto';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CredentialsMemoComponent } from '../credentials-memo/credentials-memo.component';
import { DocumentReference, DocumentData } from '@google-cloud/firestore';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  skillsList: string[];
  managersList: DocumentData[];
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private data: { skillsList: string[]; managers: DocumentReference[] }
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

  onSubmit(form: FormGroup) {
    form.invalid
      ? console.log('Invalid Form')
      : form.value.isManager
      ? this.registerUser(form)
      : this.addEmployee(form);
  }

  private addEmployee(form: FormGroup) {
    this.employeeService
      .addEmployee(this.toEmployeeDTO(form))
      .then(() => this.dialogRef.close())
      .catch((err) => console.log(err.message));
  }

  private registerUser(form: FormGroup) {
    this.userService.registerUser(this.toUserDTO(form)).subscribe(
      (res) => {
        this.matDialog.open(CredentialsMemoComponent, {
          data: { username: res.username, password: res.password },
        });
        this.dialogRef.close();
      },
      (err) => console.log(err.message)
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
      managedBy: null,
    };
    if (form.value.managedBy !== 'self-managed') {
      employee.managedBy = form.value.managedBy.id;
    }
    return employee;
  }

  private toUserDTO(form: FormGroup): UserDTO {
    const user: UserDTO = {
      uid: undefined,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      position: form.value.position,
      isAdmin: form.value.isAdmin,
      availableHours: 8,
      projects: [],
      managedBy: null,
    };
    if (form.value.managedBy !== 'self-managed') {
      user.managedBy = form.value.managedBy.id;
    }
    return user;
  }

  private setIsManagerValidators() {
    const managedByControl = this.employeeForm.get('managedBy');
    const skillsControl = this.employeeForm.get('skills');

    this.employeeForm.get('isManager').valueChanges.subscribe((isManager) => {
      if (isManager) {
        skillsControl.setValidators(null);
        skillsControl.disable();
      }

      if (!isManager) {
        skillsControl.setValidators([Validators.required]);
        skillsControl.enable();
      }

      managedByControl.updateValueAndValidity();
      skillsControl.updateValueAndValidity();
    });
  }
}
