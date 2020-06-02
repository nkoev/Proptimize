import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDTO } from 'src/app/models/employees/user.dto';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';

@Component({
  selector: 'app-orgchart',
  templateUrl: './orgchart.component.html',
  styleUrls: ['./orgchart.component.css'],
})
export class OrgChartComponent implements OnInit {
  type = 'OrgChart';
  options = { allowHtml: true };
  data = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private dialogData: {
      managers: UserDTO[];
      employees: EmployeeDTO[];
    }
  ) {}

  ngOnInit(): void {
    this.dialogData.managers.forEach((manager) => {
      const avatarUrl = manager.avatarUrl
        ? manager.avatarUrl
        : '../../../../assets/backgorund/avatar-default2.png';
      this.data.push([
        {
          v: manager.id,
          f: `<div class="orgchart"><div class="name">${manager.firstName}&nbsp;${manager.lastName}</div><img src="${avatarUrl}">
            <div class="position">${manager.position}</div></div>`,
        },
        manager.managedBy ? manager.managedBy.id : null,
      ]);
      this.dialogData.employees.forEach((employee) => {
        this.data.push([
          {
            v: employee.id,
            f: `<div class="orgchart"><div class="name">${employee.firstName}&nbsp;${employee.lastName}</div>
              <div>${employee.position}</div></div>`,
          },
          employee.managedBy ? employee.managedBy.id : null,
        ]);
      });
    });
  }
}
