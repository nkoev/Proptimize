import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-employee',
  templateUrl: './detail-employee.component.html',
  styleUrls: ['./detail-employee.component.css'],
})
export class DetailEmployeeComponent implements OnInit {
  @Input() employee: EmployeeDTO;
  @Output() backEvent = new EventEmitter<any>();
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToProject(projectId: string) {
    this.router.navigate(['/projects', { queryParams: { id: projectId } }]);
  }
}
