import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { UserDTO } from 'src/app/models/employees/user.dto';

@Component({
  selector: 'app-subordinates-list',
  templateUrl: './subordinates-list.component.html',
  styleUrls: ['./subordinates-list.component.css'],
})
export class SubordinatesListComponent implements OnInit {
  readonly subordinates: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: { subordinates: any[] },
    private dialogRef: MatDialogRef<SubordinatesListComponent>,
    private router: Router
  ) {
    this.subordinates = this.data.subordinates;
  }

  ngOnInit(): void {}

  toDetailEmployee(employee: EmployeeDTO & UserDTO): void {
    this.dialogRef.close();
    this.router.navigate(['/employees'], {
      queryParams: {
        employeeId: employee.id,
        isManager: employee.email ? true : false,
      },
    });
  }
}
