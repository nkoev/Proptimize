import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { OrgChartComponent } from '../../components/orgchart/orgchart.component';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { EmployeesFilteringFormComponent } from '../../components/employees-filtering-form/employees-filtering-form.component';
import { SkillService } from 'src/app/modules/skills/skill.service';
import { ActivatedRoute } from '@angular/router';
import { EditEmployeeComponent } from '../../components/edit-employee/edit-employee.component';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  activePane = 'left';
  showEmployee: EmployeeDTO;
  skillsList: string[];
  managers: UserDTO[];
  employees: EmployeeDTO[];
  filteredManagers: UserDTO[];
  filteredEmployees: EmployeeDTO[];
  loggedUser: UserDTO;
  today = new Date();
  @ViewChild(EmployeesFilteringFormComponent)
  filteringFormComp: EmployeesFilteringFormComponent;
  private subscriptions: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    const sub1 = this.userService.allUsers$.subscribe((users) => {
      this.managers = users;
      this.filteredManagers = this.managers;
    });
    const sub2 = this.employeeService.$allEmployees.subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees = this.employees;
    });
    const sub3 = this.route.data.subscribe(
      (data) => (this.loggedUser = data.loggedUser)
    );
    const sub4 = this.auth.loggedUser$.subscribe(
      (res) => (this.loggedUser = res)
    );
    const sub5 = this.skillService
      .getSkills()
      .subscribe((res) => (this.skillsList = res));
    google.charts.load('current', { packages: ['orgchart'] });
    this.subscriptions.push(sub1, sub2, sub3, sub4, sub5);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addEmployee(): void {
    this.matDialog.open(AddEmployeeComponent, {
      data: { skillsList: this.skillsList, managers: this.managers },
    });
  }

  editEmployee(event: Event): void {
    this.matDialog.open(EditEmployeeComponent, {
      data: { skillsList: this.skillsList, employee: event },
    });
  }

  showOrgChart(): void {
    this.matDialog.open(OrgChartComponent, {
      data: { managers: this.managers, employees: this.employees },
      maxWidth: '80vw',
      maxHeight: '80vh',
    });
  }

  showDetailEmployee(event: EmployeeDTO): void {
    this.activePane = 'right';
    this.showEmployee = event;
  }

  backToList(skill?: string): void {
    this.activePane = 'left';
    if (skill) {
      this.filteringFormComp.setSkillsField(skill);
    }
  }

  filterEmployees(event: any): void {
    this.filteredEmployees = this.employees;
    this.filteredManagers = this.managers;

    if (event.skills?.length) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) =>
        employee.skills.some((skill) => event.skills.includes(skill))
      );
    }
    if (event.firstName) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) =>
        employee.firstName.toLowerCase().includes(event.firstName.toLowerCase())
      );
      this.filteredManagers = this.filteredManagers.filter((manager) =>
        manager.firstName.toLowerCase().includes(event.firstName.toLowerCase())
      );
    }
    if (event.lastName) {
      this.filteredEmployees = this.filteredEmployees.filter((employee) =>
        employee.lastName.toLowerCase().includes(event.lastName.toLowerCase())
      );
      this.filteredManagers = this.filteredManagers.filter((manager) =>
        manager.lastName.toLowerCase().includes(event.lastName.toLowerCase())
      );
    }
    if (event.subordinates) {
      this.filteredEmployees = this.filteredEmployees.filter(
        (employee) => employee.managedBy?.id === this.loggedUser.id
      );
      this.filteredManagers = this.filteredManagers.filter(
        (manager) => manager.managedBy?.id === this.loggedUser.id
      );
    }
  }
}
