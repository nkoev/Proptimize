import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { SkillGanttDTO } from 'src/app/models/skills/skill-gantt.dto';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
const moment = require('moment-business-days');

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {
  today = new Date();

  constructor() {
    moment.updateLocale('en', {
      workingWeekdays: [1, 2, 3, 4, 5],
      holidays: ['09-07-2020', '09-22-2020', '12-24-2020', '12-25-2020', '12-28-2020'],
      holidayFormat: 'MM-DD-YYYY'
    });
  }

  private skillHasEmployees(employeesArray: FormArray): boolean {
    return 1 <= employeesArray.controls.length;
  }

  formToChartData(form: FormGroup, project: ProjectDTO): {
    startDate: Date,
    endDate: Date,
    skills: SkillGanttDTO[]
  } {
    const sumSkillHours: { skill: string, start: Date, days: number, amount: number }[] = [];
    const targetInDays = form.get('targetInDays').value;
    const startDate = Object.keys(project).length === 0 ? this.today : project.createdAt.toDate();
    const endDate = moment(startDate).businessAdd(targetInDays - 1)._d;

    const manTarget = form.get('managementTarget').value;
    const manHours = form.get('managementHours').value;
    let manDays: number;
    let manAmount: number;
    let projectManDone: number;

    if (Object.keys(project).length !== 0 && project.mUpdatedAt) {
      projectManDone = project.mDone
        + moment(project.mUpdatedAt.toDate()).businessDiff(moment(this.today)) * project.managementHours;
    }

    if (projectManDone) {
      manDays = manHours
        ? (manTarget >= projectManDone
          ? Math.ceil((manTarget - projectManDone) / manHours)
          : Math.floor((manTarget - projectManDone) / project.managementHours))
        : (manTarget > projectManDone ? -1.5 : Math.floor((manTarget - projectManDone) / project.managementHours))

      if (manTarget > projectManDone) {
        if (manDays === -1.5) {
          manAmount = 0;
        } else {
          if (manDays <= moment(this.today).businessDiff(moment(endDate))) {
            manAmount = 1;
          } else {
            manAmount = Math.round((
              ((projectManDone + moment(this.today).businessDiff(moment(endDate)) * manHours) / manTarget)
              + Number.EPSILON) * 100) / 100;
          }
        }
      } else { manAmount = 1; }
    } else {
      manDays = manHours ? Math.ceil(manTarget / manHours) : -1.5;
      manAmount = manDays === -1.5
        ? 0
        : (manDays <= targetInDays ? 1 : Math.round(((targetInDays / manDays) + Number.EPSILON) * 100) / 100);
    }

    sumSkillHours.push({
      skill: 'Management',
      start: project.mCreatedAt ? project.mCreatedAt.toDate() : this.today,
      days: manDays,
      amount: manAmount
    });

    let projectHoursDone: { skill: string, start: Date, daily: number, done: number }[];
    if (Object.keys(project).length !== 0) {
      projectHoursDone = project.skills.map(skill => {
        const daysBeen = moment(skill.updatedAt.toDate()).businessDiff(moment(this.today));
        const daily = skill.employees.reduce((acc, e) => {
          acc += e.hoursPerSkill;
          return acc;
        }, 0);
        let sumDone = skill.done + daysBeen * daily;

        return { skill: skill.name, start: skill.createdAt.toDate(), daily: daily, done: sumDone };
      });
    }

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
      let days: number;
      let amount: number;
      if (projectHoursDone && projectHoursDone.length) {
        const old = projectHoursDone.filter(p => p.skill === skill)[0];
        if (old) {
          days = sum
            ? (target >= old.done ? Math.ceil((target - old.done) / sum) : Math.floor((target - old.done) / old.daily))
            : (target > old.done ? -1.5 : Math.floor((target - old.done) / old.daily));

          if (target > old.done) {
            if (days === -1.5) {
              amount = 0;
            } else {
              if (days <= moment(this.today).businessDiff(moment(endDate))) {
                amount = 1;
              } else {
                amount = Math.round((((old.done + moment(this.today).businessDiff(moment(endDate)) * sum) / target) + Number.EPSILON) * 100) / 100;
              }
            }
          } else { amount = 1; }
          sumSkillHours.push({ skill: skill, start: old.start, days: days, amount: amount });
        } else {
          days = sum ? Math.ceil(target / sum) : -1.5;
          amount = days === -1.5
            ? 0
            : (days <= targetInDays ? 1 : Math.round(((targetInDays / days) + Number.EPSILON) * 100) / 100);
          sumSkillHours.push({ skill: skill, start: this.today, days: days, amount: amount });
        }
      } else {
        days = sum ? Math.ceil(target / sum) : -1.5;
        amount = days === -1.5
          ? 0
          : (days <= targetInDays ? 1 : Math.round(((targetInDays / days) + Number.EPSILON) * 100) / 100);
        sumSkillHours.push({ skill: skill, start: this.today, days: days, amount: amount });
      }
    });
    // const daysNeeded = Math.max(...sumSkillHours.map(s => s.days));

    const skills: SkillGanttDTO[] = [];
    sumSkillHours.forEach(s => {
      skills.push({
        skill: s.skill,
        startDate: s.start,
        endDate: s.days !== -1.5
          ? moment(this.today).businessAdd(s.days)._d
          : moment(this.today).businessAdd(targetInDays)._d,
        completeness: {
          amount: s.amount,
          fill: s.days < moment(this.today).businessDiff(moment(endDate)) ? false : true,
        }
      });
    });

    return { startDate, endDate, skills };
  }

  projectToChartData(project: ProjectDTO): {
    startDate: Date,
    endDate: Date,
    skills: SkillGanttDTO[]
  } {
    const targetInDays = project.targetInDays;
    const startDate = project.createdAt.toDate();
    const endDate = moment(startDate).businessAdd(targetInDays - 1)._d;
    const manTarget = project.managementTarget;
    const manHours = project.managementHours;
    let manDays: number;
    let manAmount: number;
    const sumSkillHours: { skill: string, start: Date, days: number, amount: number }[] = [];

    let projectManDone: number;
    if (project.mUpdatedAt) {
      projectManDone = project.mDone
        + moment(project.mUpdatedAt.toDate()).businessDiff(moment(this.today)) * project.managementHours;
    }

    if (projectManDone) {
      manDays = manHours
        ? (manTarget >= projectManDone
          ? Math.ceil((manTarget - projectManDone) / manHours)
          : Math.floor((manTarget - projectManDone) / project.managementHours))
        : (manTarget > projectManDone ? -1.5 : 0)

      if (manTarget > projectManDone) {
        if (manDays === -1.5) {
          manAmount = 0;
        } else {
          if (manDays <= moment(this.today).businessDiff(moment(endDate))) {
            manAmount = 1;
          } else {
            manAmount = Math.round((((projectManDone + moment(this.today).businessDiff(moment(endDate)) * manHours) / manTarget) + Number.EPSILON) * 100) / 100;
          }
        }
      } else { manAmount = 1; }
    } else {
      manDays = manHours ? Math.ceil(manTarget / manHours) : -1.5;
      manAmount = manDays === -1.5
        ? 0
        : (manDays <= targetInDays ? 1 : Math.round(((targetInDays / manDays) + Number.EPSILON) * 100) / 100);
    }
    sumSkillHours.push({
      skill: 'Management',
      start: project.mCreatedAt.toDate(),
      days: manDays,
      amount: manAmount
    });

    const skills: SkillGanttDTO[] = [];
    project.skills.map(skill => {
      const daysBeen = moment(skill.updatedAt.toDate()).businessDiff(moment(this.today));
      const daily = skill.employees.reduce((acc, e) => {
        acc += e.hoursPerSkill;
        return acc;
      }, 0);
      const sumDone = skill.done + daysBeen * daily;
      const target = skill.targetInHours;
      let days: number;
      let amount: number;

      days = daily
        ? (target >= sumDone ? Math.ceil((target - sumDone) / daily) : Math.floor((target - sumDone) / daily))
        : (target > sumDone ? -1.5 : Math.floor((target - sumDone) / daily));

      if (target > sumDone) {
        if (days === -1.5) {
          amount = 0;
        } else {
          if (days <= moment(this.today).businessDiff(moment(endDate))) {
            amount = 1;
          } else {
            amount = Math.round((((sumDone + moment(this.today).businessDiff(moment(endDate)) * daily) / target) + Number.EPSILON) * 100) / 100;
          }
        }
      } else { amount = 1; }

      sumSkillHours.push({ skill: skill.name, start: skill.createdAt.toDate(), days: days, amount: amount });
    });

    sumSkillHours.forEach(s => {
      skills.push({
        skill: s.skill,
        startDate: s.start,
        endDate: s.days !== -1.5
          ? moment(this.today).businessAdd(s.days)._d
          : endDate,
        completeness: {
          amount: s.amount,
          fill: s.days < moment(this.today).businessDiff(moment(endDate)) ? false : true,
        }
      });
    });

    return { startDate, endDate, skills };
  }

}
