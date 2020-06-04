import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormArray } from '@angular/forms';
import { UserService } from '../../employees/services/user.service';
import { EmployeeService } from '../../employees/services/employee.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { ProjectStatusType } from 'src/app/models/projects/project-status.type';
import { SkillDTO } from 'src/app/models/skills/skill.dto';
const moment = require('moment-business-days');

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsColl: AngularFirestoreCollection<ProjectDTO>;
  private today = new Date();

  constructor(
    private readonly afs: AngularFirestore,
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
  ) { }

  private getProjectsData(): Observable<ProjectDTO[]> {
    return this.projectsColl.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as ProjectDTO;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getAll(): Observable<ProjectDTO[]> {
    this.projectsColl = this.afs.collection<ProjectDTO>('projects', ref => ref.orderBy('createdAt', 'desc'));
    return this.getProjectsData();
  }

  async getProjectById(projectId: string):
    Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    return await this.projectsColl.doc(projectId).ref.get();
  }

  private assignProjectToUser(project: ProjectDTO, loggedUser: any): void {
    const newProject = {
      id: project.id,
      name: project.name,
      dailyInput: [{ skill: 'Management', hours: project.managementHours }]
    };

    this.userService.addProject(loggedUser.uid, newProject);
  }

  private updateUsersProjects(project: ProjectDTO, loggedUser: any, oldProject: ProjectDTO): void {
    const projectBefore = {
      id: project.id,
      name: project.name,
      dailyInput: [{ skill: 'Management', hours: oldProject.managementHours }]
    };

    const projectAfter = {
      id: project.id,
      name: project.name,
      dailyInput: [{ skill: 'Management', hours: project.managementHours }]
    };

    this.userService.removeProject(loggedUser.uid, projectBefore);
    this.userService.addProject(loggedUser.uid, projectAfter);
  }

  private assignProjectToEmployees(project: ProjectDTO): void {
    let employeeArray: { [employeeName: string]: { skill: string, hours: number }[] }[] = [];

    project.skills.forEach(skill => {
      skill.employees.forEach(e => {
        const eId = e.id;
        let objId = 0;
        if (!employeeArray.some(e => Object.keys(e).includes(eId))) {
          employeeArray.push({ [eId]: [] });
        }
        objId = employeeArray.reduce((acc, e, i) => {
          if (Object.keys(e).includes(eId)) { acc = i; }
          return acc;
        }, -1);

        employeeArray[objId][eId].push({ skill: skill.name, hours: e.hoursPerSkill });
      });
    });

    for (const e of employeeArray) {
      const eId = Object.keys(e)[0];
      const dailyInput = e[eId];
      const newProject = {
        id: project.id,
        name: project.name,
        dailyInput: dailyInput
      };
      this.employeeService.addProject(eId, newProject);
    }
  }

  private updateEmployeesProjects(project: ProjectDTO, oldProject: ProjectDTO): void {
    const employeeArrayBefore: { [employeeName: string]: { skill: string, hours: number }[] }[] = [];
    const employeeArrayAfter: { [employeeName: string]: { skill: string, hours: number }[] }[] = [];

    oldProject.skills.forEach(skill => {
      skill.employees.forEach(e => {
        const eId = e.id;
        let objId = 0;
        if (!employeeArrayBefore.some(e => Object.keys(e).includes(eId))) {
          employeeArrayBefore.push({ [eId]: [] });
        }
        objId = employeeArrayBefore.reduce((acc, e, i) => {
          if (Object.keys(e).includes(eId)) { acc = i; }
          return acc;
        }, -1);

        employeeArrayBefore[objId][eId].push({ skill: skill.name, hours: e.hoursPerSkill });
      });
    });

    project.skills.forEach(skill => {
      skill.employees.forEach(e => {
        const eId = e.id;
        let objId = 0;
        if (!employeeArrayAfter.some(e => Object.keys(e).includes(eId))) {
          employeeArrayAfter.push({ [eId]: [] });
        }
        objId = employeeArrayAfter.reduce((acc, e, i) => {
          if (Object.keys(e).includes(eId)) { acc = i; }
          return acc;
        }, -1);

        employeeArrayAfter[objId][eId].push({ skill: skill.name, hours: e.hoursPerSkill });
      });
    });

    for (const e of employeeArrayBefore) {
      const eId = Object.keys(e)[0];
      const dailyInput = e[eId];
      const newProject = {
        id: project.id,
        name: project.name,
        dailyInput: dailyInput
      };
      this.employeeService.removeProject(eId, newProject);
    }

    for (const e of employeeArrayAfter) {
      const eId = Object.keys(e)[0];
      const dailyInput = e[eId];
      const newProject = {
        id: project.id,
        name: project.name,
        dailyInput: dailyInput
      };
      this.employeeService.addProject(eId, newProject);
    }
  }

  async addProject(
    projectData: {
      name: string,
      description: string,
      targetInDays: number,
      manTarget: number,
      manHours: number,
      skills: SkillDTO[],
    },
    loggedUser: any
  ): Promise<void> {
    const newProject = {
      reporter: {
        id: loggedUser.uid,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName
      },
      name: projectData.name,
      description: projectData.description,
      targetInDays: projectData.targetInDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      managementTarget: projectData.manTarget || 0,
      managementHours: projectData.manHours || 0,
      mDone: 0,
      mCreatedAt: projectData.manTarget ? new Date() : null,
      mUpdatedAt: projectData.manTarget ? new Date() : null,
      status: ProjectStatusType.InProgress,
      skills: projectData.skills,
    }

    const projectRef = this.projectsColl.add(newProject);
    this.assignProjectToUser({ id: (await projectRef).id, ...newProject }, loggedUser);
    this.assignProjectToEmployees({ id: (await projectRef).id, ...newProject });
  }

  async updateProject(
    projectData: {
      name: string,
      description: string,
      targetInDays: number,
      manTarget: number,
      manHours: number,
      skills: SkillDTO[],
    },
    loggedUser: any,
    oldProject: ProjectDTO
  ): Promise<void> {
    let manDone = 0;
    if (oldProject.mCreatedAt) {
      const daysBeen = moment(oldProject.mUpdatedAt.toDate()).businessDiff(moment(this.today));
      manDone = oldProject.mDone + daysBeen * oldProject.managementHours;
    }

    const newProject = {
      reporter: {
        id: loggedUser.uid,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName
      },
      name: projectData.name,
      description: projectData.description,
      targetInDays: projectData.targetInDays,
      createdAt: oldProject.createdAt,
      managementTarget: projectData.manTarget || 0,
      managementHours: projectData.manHours || 0,
      mDone: manDone,
      mCreatedAt: oldProject.mCreatedAt
        ? oldProject.mCreatedAt
        : (projectData.manTarget ? new Date() : null),
      mUpdatedAt: new Date(),
      status: ProjectStatusType.InProgress,
      skills: projectData.skills,
    }

    this.projectsColl.doc(oldProject.id).update(newProject);
    const updatedProject = this.getProjectById(oldProject.id);
    this.updateUsersProjects(
      { id: (await updatedProject).id, ...(await updatedProject).data() } as ProjectDTO,
      loggedUser,
      oldProject
    );
    this.updateEmployeesProjects(
      { id: (await updatedProject).id, ...(await updatedProject).data() } as ProjectDTO,
      oldProject,
    );
  }

  private projectHasSkills(skillsArray: FormArray): boolean {
    return 1 <= skillsArray.controls.length;
  }

  private skillHasEmployees(employeesArray: FormArray): boolean {
    return 1 <= employeesArray.controls.length;
  }

  formToProjectData(form: FormControl, oldProject?: ProjectDTO): {
    name: string,
    description: string,
    targetInDays: number,
    manTarget: number,
    manHours: number,
    skills: SkillDTO[],
  } {
    const projectData = {
      name: form.get('name').value,
      description: form.get('description').value,
      targetInDays: form.get('targetInDays').value,
      manTarget: form.get('managementTarget').value,
      manHours: form.get('managementHours').value,
      skills: [],
    };
    const skillsArray = form.get('skills') as FormArray;
    if (this.projectHasSkills(skillsArray)) {
      skillsArray.controls.forEach(skill => {
        const skillData = {} as SkillDTO;
        skillData.name = skill.get('skill').value;
        skillData.targetInHours = skill.get('targetInHours').value;
        let foundSkill: SkillDTO;
        if (oldProject) {
          foundSkill = oldProject.skills.filter(s => s.name === skillData.name)[0];
        }
        let sumDone: number;
        if (foundSkill) {
          const daysBeen = moment(foundSkill.updatedAt.toDate()).businessDiff(moment(this.today));
          const daily = foundSkill.employees.reduce((acc, e) => {
            acc += e.hoursPerSkill;
            return acc;
          }, 0);
          sumDone = foundSkill.done + daysBeen * daily;
        }
        skillData.createdAt = foundSkill ? foundSkill.createdAt : new Date();
        skillData.updatedAt = new Date();
        skillData.done = foundSkill ? sumDone : 0;
        skillData.employees = [];
        const employeesArray = skill.get('employees') as FormArray;
        if (this.skillHasEmployees(employeesArray)) {
          employeesArray.controls.forEach(e => {
            const employeeData = {
              id: e.get('employee').value.id,
              firstName: e.get('employee').value.firstName,
              lastName: e.get('employee').value.lastName,
              hoursPerSkill: e.get('hoursPerSkill').value,
            };
            skillData.employees.push(employeeData);
          });
        }
        projectData.skills.push(skillData);
      });
    }

    return projectData;
  }

  closeProject(project: ProjectDTO, loggedUser: any): void {
    let employeeArray: { [employeeName: string]: { skill: string, hours: number }[] }[] = [];
    const closedProject = {
      id: project.id,
      name: project.name,
      dailyInput: [{ skill: 'Management', hours: project.managementHours }]
    };

    project.skills.forEach(skill => {
      skill.employees.forEach(e => {
        const eId = e.id;
        let objId = 0;
        if (!employeeArray.some(e => Object.keys(e).includes(eId))) {
          employeeArray.push({ [eId]: [] });
        }
        objId = employeeArray.reduce((acc, e, i) => {
          if (Object.keys(e).includes(eId)) { acc = i; }
          return acc;
        }, -1);

        employeeArray[objId][eId].push({ skill: skill.name, hours: e.hoursPerSkill });
      });
    });

    const skillsFree = project.skills.map(s => {
      const daysBeen = moment(s.updatedAt.toDate()).businessDiff(moment(this.today));
      const daily = s.employees.reduce((acc, e) => {
        acc += e.hoursPerSkill;
        return acc;
      }, 0);
      s.done = s.done + daysBeen * daily;
      s.updatedAt = new Date();
      s.employees = s.employees.map(e => {
        e.hoursPerSkill = 0;
        return e;
      });

      return s;
    });

    let manDone = 0;
    if (project.mCreatedAt) {
      const daysBeen = moment(project.mUpdatedAt.toDate()).businessDiff(moment(this.today));
      manDone = project.mDone + daysBeen * project.managementHours;
    }

    // console.log(skillsFree);
    // console.log(manDone);

    this.projectsColl.doc(project.id).update({
      status: ProjectStatusType.Closed,
      mDone: manDone,
      managementHours: 0,
      mUpdatedAt: new Date(),
      skills: skillsFree,
    });

    this.userService.removeProject(loggedUser.uid, closedProject);
    for (const e of employeeArray) {
      const eId = Object.keys(e)[0];
      const dailyInput = e[eId];
      const newProject = {
        id: project.id,
        name: project.name,
        dailyInput: dailyInput
      };
      this.employeeService.removeProject(eId, newProject);
    }
  }

  getProjectsEmployees(project: ProjectDTO): { [employeeName: string]: { skill: string, hours: number }[] }[] {
    let employeeArray: { [employeeName: string]: { skill: string, hours: number }[] }[] = [];

    project.skills.forEach(skill => {
      skill.employees.forEach(e => {
        const eId = e.firstName + ' ' + e.lastName;
        let objId = 0;
        if (!employeeArray.some(e => Object.keys(e).includes(eId))) {
          employeeArray.push({ [eId]: [] });
        }
        objId = employeeArray.reduce((acc, e, i) => {
          if (Object.keys(e).includes(eId)) { acc = i; }
          return acc;
        }, -1);

        employeeArray[objId][eId].push({ skill: skill.name, hours: e.hoursPerSkill });
      });

      const eId = project.reporter.firstName + ' ' + project.reporter.lastName;
      employeeArray.push({ [eId]: [] });
      employeeArray[employeeArray.length - 1][eId].push({ skill: 'Management', hours: project.managementHours });
    });

    return employeeArray;
  }
}
