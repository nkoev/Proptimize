import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeTasksComponent } from '../employee-tasks/employee-tasks.component';

@Component({
  selector: 'app-detail-employee',
  templateUrl: './detail-employee.component.html',
  styleUrls: ['./detail-employee.component.css'],
})
export class DetailEmployeeComponent implements OnInit {
  @Input() employee: any;
  @Output() backEvent = new EventEmitter<any>();
  constructor(private router: Router, private matDialog: MatDialog) {}

  ngOnInit(): void {}

  goToProject(projectId: string) {
    this.router.navigate(['/projects'], { queryParams: { id: projectId } });
  }

  showTasks(employeeInput) {
    this.matDialog.open(EmployeeTasksComponent, { data: { employeeInput } });
  }
}
