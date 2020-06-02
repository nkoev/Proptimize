import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentData } from '@google-cloud/firestore';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  type = 'employees';
  @Input() filteredEmployees: EmployeeDTO[];
  @Input() filteredManagers: UserDTO[];
  @Input() loggedUser: UserDTO;
  @Output() showEmployee = new EventEmitter<any>();
  @Output() editEmployee = new EventEmitter<EmployeeDTO>();
  constructor() {}

  ngOnInit(): void {}
}
