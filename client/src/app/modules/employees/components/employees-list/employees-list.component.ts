import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentData } from '@google-cloud/firestore';
import { EmployeesFilteringFormComponent } from '../employees-filtering-form/employees-filtering-form.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  type = 'employees';
  @Input() filteringFormComp: EmployeesFilteringFormComponent;
  @Input() filteredEmployees: DocumentData[];
  @Input() filteredManagers: DocumentData[];
  @Output() showEmployee = new EventEmitter<DocumentData>();
  constructor() {}

  ngOnInit(): void {}
}
