import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { DocumentData } from '@angular/fire/firestore/interfaces';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { OrgChartComponent } from '../../components/orgchart/orgchart.component';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  activePane = 'left';
  skillsList = [
    'Java',
    'JavaScript',
    'BellyDancing',
    'Java',
    'JavaScript',
    'BellyDancing',
    'Java',
    'JavaScript',
    'BellyDancing',
  ];
  managers: DocumentData[];
  employees: DocumentData[];
  filteredManagers: DocumentData[];
  filteredEmployees: DocumentData[];
  loggedUser: DocumentData;
  today = new Date();
  private subscriptions: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const sub1 = this.userService.allUsers$.subscribe((users) => {
      this.managers = users;
      this.filteredManagers = this.managers.map((manager) => manager.data());
    });
    const sub2 = this.employeeService.$allEmployees.subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees = this.employees.map((employee) =>
        employee.data()
      );
    });
    const sub3 = this.auth.loggedUser$.subscribe(
      (res) => (this.loggedUser = res)
    );
    google.charts.load('current', { packages: ['orgchart'] });
    this.subscriptions.push(sub1, sub2, sub3);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addEmployee() {
    this.matDialog.open(AddEmployeeComponent, {
      data: { skillsList: this.skillsList, managers: this.managers },
    });
  }

  showOrgChart() {
    this.matDialog.open(OrgChartComponent, {
      data: { managers: this.managers, employees: this.employees },
    });
  }

  showDetailEmployee(event) {
    this.activePane = 'right';
  }

  filterEmployees(event: any) {
    this.filteredEmployees = this.employees.map((employee) => employee.data());
    if (event.skills?.length) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) =>
        employee.skills.some((skill) => event.skills.includes(skill))
      );
    }
    if (event.firstName) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) =>
        employee.firstName.toLowerCase().includes(event.firstName.toLowerCase())
      );
    }
    if (event.lastName) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) =>
        employee.lastName.toLowerCase().includes(event.lastName.toLowerCase())
      );
    }
    if (event.subordinates) {
      this.filteredEmployees = this.filteredEmployees.filter(
        (employee) => employee.managedBy === this.loggedUser.uid
      );
    }
  }
}
