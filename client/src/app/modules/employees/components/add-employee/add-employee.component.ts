import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employee.dto';
import { UserService } from '../../services/user.service';
import { UserDTO } from 'src/app/models/user.dto';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  skillsList = ['Java', 'JavaScript', 'BellyDancing'];
  managersList = ['Boncho', 'Concho', 'Paraponcho'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      firstName: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      position: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      isManager: false,
      isAdmin: false,
      managedBy: [null, Validators.required],
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
    if (form.valid) {
      form.value.isManager
        ? this.userService
            .addUser(this.toUserDTO(form))
            .then((res) => console.log(res.id))
            .catch((err) => console.log(err))
        : this.employeeService
            .addEmployee(this.toEmployeeDTO(form))
            .then((res) => console.log(res.id))
            .catch((err) => console.log(err));
    } else {
      console.log('Invalid Form');
    }
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
      password: Math.round(Math.random() * (99999 - 10000) + 10000),
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      position: form.value.position,
      isAdmin: form.value.isAdmin,
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
        managedByControl.setValidators(null);
        managedByControl.disable();
        skillsControl.setValidators(null);
        skillsControl.disable();
      }

      if (!isManager) {
        managedByControl.setValidators([Validators.required]);
        managedByControl.enable();
        skillsControl.setValidators([Validators.required]);
        skillsControl.enable();
      }

      managedByControl.updateValueAndValidity();
      skillsControl.updateValueAndValidity();
    });
  }
}
