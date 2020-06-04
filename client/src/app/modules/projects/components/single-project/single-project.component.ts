import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { GanttService } from '../../services/gantt.service';
import { ProjectService } from '../../services/project.service';
import { SkillGanttDTO } from 'src/app/models/skills/skill-gantt.dto';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { DataFormatterService } from '../../services/data-formatter.service';

@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.css']
})
export class SingleProjectComponent implements OnInit {

  @Output() toggleEvent = new EventEmitter<boolean>();
  @Input() project: ProjectDTO;
  @ViewChild('charts') public chartEl: ElementRef;

  employees: { [employeeName: string]: { skill: string, hours: number }[] }[];
  employeeNames: string[] = [];
  employeeInput: { skill: string, hours: number }[][] = [];

  constructor(
    private readonly ganttService: GanttService,
    private readonly projectServise: ProjectService,
    private readonly dataFormatterService: DataFormatterService,
  ) { }

  ngOnInit(): void { }

  loadChart(): void {
    let startDate: Date;
    let endDate: Date;
    let skills: SkillGanttDTO[];

    setTimeout(() => {
      ({ startDate, endDate, skills } = this.dataFormatterService.projectToChartData(this.project));
      this.loadEmployees();
      this.ganttService.drawGantt(this.chartEl.nativeElement, this.project.name, startDate, endDate, skills);
    }, 0);
  }

  loadEmployees(): void {
    this.employees = this.projectServise.getProjectsEmployees(this.project);
    this.employeeNames = this.employees.map(e => Object.keys(e)[0]);
    this.employeeInput = this.employees.map((e) => e[Object.keys(e)[0]]);
  }

  togglePanes(): void {
    this.toggleEvent.emit(true);
  }

}
