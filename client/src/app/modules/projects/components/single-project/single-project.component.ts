import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { GanttService } from '../../services/gantt.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.css']
})
export class SingleProjectComponent implements OnInit {

  @Output() toggleEvent = new EventEmitter<boolean>();
  @Input() project: any;
  @ViewChild('charts') public chartEl: ElementRef;

  employees: any[];
  employeeNames: string[] = [];
  employeeInput: any[] = [];

  constructor(
    private readonly ganttService: GanttService,
    private readonly projectServise: ProjectService,
  ) { }

  ngOnInit(): void {
  }

  loadChart() {
    let startDate: Date;
    let endDate: Date;
    let skills: { skill: string, startDate: Date, endDate: Date, completeness: { amount: number, fill: boolean } }[];
    setTimeout(() => {
      ({ startDate, endDate, skills } = this.ganttService.projectToChartData(this.project));
      this.loadEmployees();
      this.ganttService.drawGantt(this.chartEl.nativeElement, this.project.name, startDate, endDate, skills);
    }, 1000);


  }

  loadEmployees() {
    this.employees = this.projectServise.getProjectsEmployees(this.project);
    this.employeeNames = this.employees.map(e => Object.keys(e)[0]);
    this.employeeInput = this.employees.map((e) => e[Object.keys(e)[0]]);
    console.log(this.employeeInput);
  }

  togglePanes() {
    this.toggleEvent.emit(true);
  }

}
