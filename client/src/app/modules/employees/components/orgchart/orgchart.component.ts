import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentData } from '@angular/fire/firestore/interfaces';

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
      managers: DocumentData[];
      employees: DocumentData[];
    }
  ) {}

  ngOnInit(): void {
    this.dialogData.managers.forEach((manager) => {
      this.data.push([
        {
          v: manager.id,
          f: `<div class="orgchart-name">${manager.data().firstName}&nbsp;${
            manager.data().lastName
          }</div>
            <div class="orgchart-position">${manager.data().position}</div>`,
        },
        manager.data().managedBy,
      ]);
      this.dialogData.employees.forEach((employee) => {
        this.data.push([
          {
            v: employee.id,
            f: `<div class="orgchart-name">${employee.data().firstName}&nbsp;${
              employee.data().lastName
            }</div>
              <div class="orgchart-position">${employee.data().position}</div>`,
          },
          employee.data().managedBy,
        ]);
      });
    });
  }
}
