import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from 'src/app/models/employee.dto';
import { EmployeesModule } from '../../employees.module';
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
  managersList = ['Boncho', 'Concho', 'Self-managed'];

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
      managedBy: null,
      skills: [],
    });
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
    form.value.isManager
      ? this.userService.addUser(this.toUserDTO(form))
      : this.employeeService.addEmployee(this.toEmployeeDTO(form));
    console.log(form.value);
  }

  toEmployeeDTO(form: FormGroup): EmployeeDTO {
    const employee: EmployeeDTO = {
      ...form.value,
      availableHours: 8,
      projects: [],
    };
    return employee;
  }

  toUserDTO(form: FormGroup): UserDTO {
    const user: UserDTO = {
      ...form.value,
      availableHours: 8,
      projects: [],
    };
    return user;
  }
}
