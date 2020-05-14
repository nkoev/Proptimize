import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';
import { EmployeeService } from '../../services/employee.service';
import {
  DocumentData,
  DocumentReference,
} from '@angular/fire/firestore/interfaces';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  skillsList = ['Java', 'JavaScript', 'BellyDancing'];
  managersList: DocumentReference[];
  today = new Date();
  employees: DocumentData[];
  filteredEmployees: DocumentData[];
  loggedUserData: DocumentData;
  private subscriptions: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const sub1 = this.employeeService.getAllEmployees().subscribe((changes) => {
      this.employees = changes.map((change) => change.payload.doc.data());
      this.filteredEmployees = this.employees;
    });
    const sub2 = this.auth.loggedUser$.subscribe((res) =>
      this.userService
        .getUserById(res.uid)
        .then((doc) => (this.loggedUserData = doc.data()))
    );
    const sub3 = this.userService.allUsers$.subscribe(
      (changes) =>
        (this.managersList = changes.map((change) => change.payload.doc))
    );
    this.subscriptions.push(sub1, sub2, sub3);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addEmployee() {
    this.matDialog.open(AddEmployeeComponent, {
      data: { skillsList: this.skillsList, managersList: this.managersList },
    });
  }

  filterEmployees(event: any) {
    this.filteredEmployees = this.employees;
    if (event.skills?.length) {
      this.filteredEmployees = this.employees.filter((employee) =>
        employee.skills.some((skill) => event.skills.includes(skill))
      );
    }
    if (event.firstName) {
      this.filteredEmployees = this.employees.filter((employee) =>
        employee.firstName.toLowerCase().includes(event.firstName.toLowerCase())
      );
    }
    if (event.lastName) {
      this.filteredEmployees = this.employees.filter((employee) =>
        employee.lastName.toLowerCase().includes(event.lastName.toLowerCase())
      );
    }
    if (event.subordinates) {
      this.filteredEmployees = this.employees.filter((employee) =>
        this.loggedUserData.subordinates.includes(employee.managedBy)
      );
    }
  }
}
