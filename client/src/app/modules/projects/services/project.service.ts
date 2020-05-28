import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { ProjectStatusType } from 'src/app/models/projects/project-status.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormArray } from '@angular/forms';
import { UserService } from '../../employees/services/user.service';
import { EmployeeService } from '../../employees/services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsColl: AngularFirestoreCollection<ProjectDTO>;

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

  getAll() {
    this.projectsColl = this.afs.collection<ProjectDTO>('projects', ref => ref.orderBy('createdAt', 'desc'));
    return this.getProjectsData();
  }

  private async assignProjectToUser(project: any, loggedUser: any) {
    const newProject = {
      id: project.id,
      name: project.name,
      dailyInput: [{ skill: 'Management', hours: project.managementHours }]
    };

    this.userService.addProject(loggedUser.uid, newProject);
  }

  private async assignProjectToEmployees(project: any) {
    let employeeArray: any[] = [];
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

  async addProject(projectData: any, loggedUser: any): Promise<any> {
    const newProject: any = {
      reporter: {
        id: loggedUser.uid,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName
      },
      name: projectData.name,
      description: projectData.description,
      targetInDays: projectData.targetInDays,
      managementTarget: projectData.manTarget || 0,
      managementHours: projectData.manHours || 0,
      createdAt: new Date(),
      status: ProjectStatusType.InProgress,
      skills: projectData.skills,
    }

    const projectRef = this.projectsColl.add(newProject);
    this.assignProjectToUser({ id: (await projectRef).id, ...newProject }, loggedUser);
    this.assignProjectToEmployees({ id: (await projectRef).id, ...newProject });
    return projectRef;
  }

  private projectHasSkills(skillsArray: FormArray): boolean {
    return 1 <= skillsArray.controls.length;
  }

  private skillHasEmployees(employeesArray: FormArray): boolean {
    return 1 <= employeesArray.controls.length;
  }

  formToProjectData(form: FormControl) {
    const projectData = {} as any;
    projectData.name = form.get('name').value;
    projectData.description = form.get('description').value;
    projectData.targetInDays = form.get('targetInDays').value;
    projectData.manTarget = form.get('managementTarget').value;
    projectData.manHours = form.get('managementHours').value;
    projectData.skills = [];
    const skillsArray = form.get('skills') as FormArray;
    if (this.projectHasSkills(skillsArray)) {
      skillsArray.controls.forEach(skill => {
        const skillData = {} as any;
        skillData.name = skill.get('skill').value;
        skillData.targetInHours = skill.get('targetInHours').value;
        skillData.done = 0;
        skillData.updatedAt = new Date();
        skillData.employees = [];
        const employeesArray = skill.get('employees') as FormArray;
        if (this.skillHasEmployees(employeesArray)) {
          employeesArray.controls.forEach(e => {
            const employeeData = {} as any;
            employeeData.id = e.get('employee').value.id;
            employeeData.firstName = e.get('employee').value.firstName;
            employeeData.lastName = e.get('employee').value.lastName;
            employeeData.hoursPerSkill = e.get('hoursPerSkill').value;
            skillData.employees.push(employeeData);
          });
        }
        projectData.skills.push(skillData);
      });
    }

    return projectData;
  }

}
