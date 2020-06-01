import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentData } from '@google-cloud/firestore';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  type = 'employees';
  @Input() filteredEmployees: DocumentData[];
  @Input() filteredManagers: DocumentData[];
  @Input() loggedUser: DocumentData;
  @Output() showEmployee = new EventEmitter<DocumentData>();
  @Output() editEmployee = new EventEmitter<DocumentData>();
  constructor() {}

  ngOnInit(): void {}
}
