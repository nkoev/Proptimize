import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts-gantt.src';
import { FormGroup, FormArray } from '@angular/forms';
const moment = require('moment-business-days');

@Injectable({
  providedIn: 'root'
})
export class GanttService {
  today = new Date();

  constructor() {
    moment.updateLocale('en', {
      workingWeekdays: [1, 2, 3, 4, 5],
      holidays: ['09-07-2020', '09-22-2020', '12-24-2020', '12-25-2020', '12-28-2020'],
      holidayFormat: 'MM-DD-YYYY'
    });
  }

  skillHasEmployees(employeesArray: FormArray): boolean {
    return 1 <= employeesArray.controls.length;
  }

  shouldDisplayChart(form: FormGroup): 1 | 2 | 3 {
    const skillsArray = form.get('skills') as FormArray;
    if (skillsArray.controls.length < 1) {
      return 2;
    }
    const anyEmployees = skillsArray.controls.some(c => {
      const control = c.get('employees') as FormArray;
      return this.skillHasEmployees(control);
    });

    return anyEmployees ? 1 : 3;
  }

  formToChartData(form: FormGroup): {
    endDate: Date,
    skills: { skill: string, endDate: Date, completeness: { amount: number, fill: boolean } }[]
  } {
    let endDate: Date;
    const skills: { skill: string, endDate: Date, completeness: { amount: number, fill: boolean } }[] = [];

    let sumSkillHours: { skill: string, days: number }[] = [];
    const targetInDays = form.get('targetInDays').value;
    const skillsC = form.get('skills') as FormArray;
    skillsC.controls.forEach(c => {
      const control = c.get('employees') as FormArray;
      let sum = 0;
      if (this.skillHasEmployees(control)) {
        sum = control.controls.reduce((acc, e) => {
          acc += e.get('hoursPerSkill').value;
          return acc;
        }, 0);
      } else { sum = 0; }
      const target = c.get('targetInHours').value;
      const skill = c.get('skill').value;
      const days = sum ? Math.ceil(target / sum) : -1;
      sumSkillHours.push({ skill: skill, days: days });
    });
    // const daysNeeded = Math.max(...sumSkillHours.map(s => s.days));
    endDate = moment(this.today).businessAdd(targetInDays)._d;
    sumSkillHours.forEach(s => {
      skills.push({
        skill: s.skill,
        endDate: s.days !== -1
          ? moment(this.today).businessAdd(s.days)._d
          : moment(this.today).businessAdd(targetInDays)._d,
        completeness: {
          amount: s.days === -1 ? 0 : (s.days <= targetInDays ? 1 : Math.round(((targetInDays / s.days) + Number.EPSILON) * 100) / 100),
          fill: s.days <= targetInDays ? false : true,
        }
      });
    });

    return { endDate, skills };
  }

  buildSeries(
    skills: { skill: string, endDate: Date, completeness: { amount: number, fill: boolean } }[]
  ): { name: string, start: number, end: number, completed: { amount: number, fill?: string } }[] {
    let series: { name: string, start: number, end: number, completed: { amount: number, fill?: string } }[] = [];

    skills.forEach(skill => {
      let entry: { name: string, start: number, end: number, completed: { amount: number, fill?: string } } = {} as any;
      entry.name = skill.skill;
      entry.start = Date.UTC(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      entry.end = Date.UTC(skill.endDate.getFullYear(), skill.endDate.getMonth(), skill.endDate.getDate());
      entry.completed = {} as any;
      entry.completed.amount = skill.completeness.amount;
      entry.completed.fill = skill.completeness.fill ? '#bfe3b6' : '#15DB95';

      series.push(entry);
    });

    return series;
  }

  drawGantt(
    elRef: HTMLElement,
    projectName: string,
    endDate: Date,
    skills: { skill: string, endDate: Date, completeness: { amount: number, fill: boolean } }[],
  ) {
    const series = this.buildSeries(skills);

    Highcharts.ganttChart(elRef, {
      title: {
        text: `Project Period:  ${moment(this.today).format('ll')} - ${moment(endDate).format('ll')}`
      },
      xAxis: {
        min: Date.UTC(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
        max: Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      },
      colors: ['#f78888'],
      series: [{
        name: projectName,
        data: series,
        type: undefined
      }]
    });
  }

}
