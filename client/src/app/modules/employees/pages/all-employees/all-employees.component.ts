import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../../components/add-employee/add-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { DocumentData } from '@angular/fire/firestore/interfaces';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit {
  skillsList = ['Java', 'JavaScript', 'BellyDancing'];
  managersList = ['Boncho', 'Concho', 'Paraponcho'];
  today = new Date();
  employees: DocumentData[];
  filteredEmployees: DocumentData[];
  loggedUserData;

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((changes) => {
      this.employees = changes.map((change) => change.payload.doc.data());
      this.filteredEmployees = this.employees;
    });
    this.auth.loggedUser$.subscribe((res) =>
      this.userService
        .getUserById(res.uid)
        .then((doc) => (this.loggedUserData = doc.data()))
    );
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
