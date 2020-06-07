import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts-gantt.src';
import { FormGroup, FormArray } from '@angular/forms';
import { SkillGanttDTO } from 'src/app/models/skills/skill-gantt.dto';
import { SkillSeriesDTO } from 'src/app/models/skills/skill-series.dto';
const moment = require('moment-business-days');

@Injectable({
  providedIn: 'root',
})
export class GanttService {
  today = new Date();

  constructor() {}

  private skillHasEmployees(employeesArray: FormArray): boolean {
    return 1 <= employeesArray.controls.length;
  }

  shouldDisplayChart(form: FormGroup): 1 | 2 | 3 {
    const skillsArray = form.get('skills') as FormArray;
    if (skillsArray.controls.length < 1) {
      return 2;
    }
    const anyEmployees = skillsArray.controls.some((c) => {
      const control = c.get('employees') as FormArray;
      return this.skillHasEmployees(control);
    });

    return anyEmployees ? 1 : 3;
  }

  buildSeries(skills: SkillGanttDTO[]): SkillSeriesDTO[] {
    const series: SkillSeriesDTO[] = [];

    skills.forEach((skill) => {
      const entry: SkillSeriesDTO = {
        name: skill.skill,
        start: Date.UTC(
          skill.startDate.getFullYear(),
          skill.startDate.getMonth(),
          skill.startDate.getDate()
        ),
        end: Date.UTC(
          skill.endDate.getFullYear(),
          skill.endDate.getMonth(),
          skill.endDate.getDate()
        ),
        completed: {
          amount: skill.completeness.amount,
          fill: skill.completeness.fill ? '#bfe3b6' : '#15DB95',
        },
      };

      series.push(entry);
    });

    return series;
  }

  drawGantt(
    elRef: HTMLElement,
    projectName: string,
    startDate: Date,
    endDate: Date,
    skills: SkillGanttDTO[]
  ): void {
    const series = this.buildSeries(skills);
    const actualEndDate = new Date(
      Math.max.apply(
        null,
        skills.map((s) => s.endDate)
      )
    );

    Highcharts.ganttChart(elRef, {
      title: {
        text: `Project Period:  ${moment(startDate).format('ll')} - ${moment(
          endDate
        ).format('ll')}`,
      },
      xAxis: {
        min: Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        ),
        max: Date.UTC(
          actualEndDate.getFullYear(),
          actualEndDate.getMonth(),
          actualEndDate.getDate()
        ),
      },
      tooltip: {
        dateTimeLabelFormats: {
          day: '%A, %b %e',
        },
      },
      colors: ['#f78888'],
      series: [
        {
          name: projectName,
          data: series,
          type: undefined,
        },
      ],
    });
  }
}
