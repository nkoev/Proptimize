import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  skillsList = ['Java', 'JavaScript', 'BellyDancing'];
  managersList = ['Boncho', 'Concho', 'Self-managed'];

  constructor(private fb: FormBuilder, private router: Router) {}

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
      skills: null,
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

  onSubmit(form: FormGroup) {}
}
