import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-detail-employee',
  templateUrl: './detail-employee.component.html',
  styleUrls: ['./detail-employee.component.css'],
})
export class DetailEmployeeComponent implements OnInit {
  @Input() employee: EmployeeDTO & UserDTO;
  @Output() backEvent = new EventEmitter();
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToProject(projectId: string): void {
    this.router.navigate(['/projects'], { queryParams: { id: projectId } });
  }
}
