import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { GanttService } from '../../services/gantt.service';
import { NotificationService } from 'src/app/modules/core/services/notification.service';
import { DataFormatterService } from '../../services/data-formatter.service';
import { ProjectDTO } from 'src/app/models/projects/project.dto';
import { EmployeeDTO } from 'src/app/models/employees/employee.dto';
import { UserDTO } from 'src/app/models/employees/user.dto';

export interface ProjectDialogData {
  skillsList: string[];
  employeesList: Observable<EmployeeDTO[]>;
  loggedUser: UserDTO;
  currentProject: ProjectDTO;
}

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  @ViewChildren('sl3') hoursPrev: QueryList<MatSelect>;
  @ViewChild('charts') public chartEl: ElementRef;
  loggedUser: UserDTO;
  currentProject: ProjectDTO;
  projectForm: FormGroup;
  skillsList: string[];
  skillsListD: string[] = [];
  employeesListData: Observable<EmployeeDTO[]>;
  employeesList: EmployeeDTO[] = [];
  employeesListFiltered: EmployeeDTO[][] = [];
  selectedEmployeesList: EmployeeDTO[][] = [];
  hours = Array(8)
    .fill(0)
    .map((_, i) => i + 1);
  hoursPerEmployeeMap: Map<EmployeeDTO, number> = new Map<
    EmployeeDTO,
    number
  >();
  hoursHelper = 0;
  managementHours = 0;
  showChart: 1 | 2 | 3 = 1;
  canSubmit = false;

  static openProjectDialog(
    dialog: MatDialog,
    dialogData: ProjectDialogData
  ): Observable<any> {
    const dialogRef = dialog.open(AddProjectComponent, {
      data: {
        skillsList: dialogData.skillsList,
        employeesList: dialogData.employeesList,
        loggedUser: dialogData.loggedUser,
        currentProject: dialogData.currentProject,
      },
    });

    dialogRef.disableClose = true;
    return dialogRef.afterClosed();
  }

  constructor(
    public readonly dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData,
    private readonly fb: FormBuilder,
    private readonly ganttService: GanttService,
    private readonly notificationService: NotificationService,
    private readonly dataFormatter: DataFormatterService
  ) {
    this.skillsList = this.data.skillsList;
    this.employeesListData = this.data.employeesList;
    this.loggedUser = this.data.loggedUser;
    this.currentProject = this.data.currentProject;
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: [
        this.currentProject.name,
        [Validators.required, Validators.maxLength(20)],
      ],
      description: [
        this.currentProject.description,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
      targetInDays: [
        this.currentProject.targetInDays,
        [Validators.required, Validators.min(1), Validators.max(300)],
      ],
      managementTarget: [
        this.currentProject.managementTarget,
        [Validators.min(1), Validators.max(20000)],
      ],
      managementHours: [
        this.currentProject.managementHours,
        [Validators.min(1), Validators.max(8)],
      ],
      skills: this.fb.array([]),
    });

    this.employeesListData.subscribe((data) => {
      this.employeesList = data;
      if (Object.keys(this.currentProject).length !== 0) {
        this.fillUpdateForm();
      }
    });

    this.projectForm.valueChanges.subscribe((form) => this.onFormChanges(form));
  }

  get name() {
    return this.projectForm.get('name');
  }
  get targetInDays() {
    return this.projectForm.get('targetInDays');
  }
  get description() {
    return this.projectForm.get('description');
  }
  get managementTarget() {
    return this.projectForm.get('managementTarget');
  }
  get skills() {
    return this.projectForm.get('skills') as FormArray;
  }
  getTargetInHours(idxSkill: number) {
    const control = this.skills;
    return control.at(idxSkill)['controls']['targetInHours'];
  }

  private newSkill(): FormGroup {
    return this.fb.group({
      skill: [null, [Validators.required]],
      targetInHours: [
        null,
        [Validators.required, Validators.min(0), Validators.max(20000)],
      ],
      employees: this.fb.array([]),
    });
  }

  private newEmployee(): FormGroup {
    return this.fb.group({
      employee: [null, [Validators.required]],
      hoursPerSkill: [
        null,
        [Validators.required, Validators.min(1), Validators.max(8)],
      ],
    });
  }

  addSkill(event?: MouseEvent): void {
    this.skills.push(this.newSkill());
    event?.preventDefault();

    this.selectedEmployeesList[this.skills.length - 1] = [];
  }

  addEmployee(idxSkill: number, event?: MouseEvent): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    control.push(this.newEmployee());
    event?.preventDefault();
  }

  removeSkill(idxSkill: number, event: MouseEvent): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    control.controls.forEach((c, idxEmployee) => {
      const employee = { ...c['controls']['employee'].value };
      if (Object.keys(employee).length !== 0) {
        this.updateHoursMap(idxSkill, idxEmployee, control);
      }
    });
    this.skills.removeAt(idxSkill);
    this.employeesListFiltered.splice(idxSkill, 1);
    this.selectedEmployeesList.splice(idxSkill, 1);
    event.preventDefault();
  }

  removeEmployee(idxSkill: number, idxEmployee: number): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    this.updateHoursMap(idxSkill, idxEmployee, control);
    control.removeAt(idxEmployee);
    this.selectedEmployeesList[idxSkill].splice(idxEmployee, 1);
  }

  private fillUpdateForm(): void {
    this.managementHours = this.currentProject.managementHours;

    if (1 <= this.currentProject.skills.length) {
      this.currentProject.skills.forEach((skill, idxSkill) => {
        this.addSkill();
        this.skills.at(idxSkill).get('skill').setValue(skill.name);
        this.skills
          .at(idxSkill)
          .get('targetInHours')
          .setValue(skill.targetInHours);
        this.getSkilledEmployees(skill.name, idxSkill);

        if (1 <= skill.employees.length) {
          skill.employees.forEach((e, idxEmployee) => {
            this.addEmployee(idxSkill);
            const employee = this.employeesList.filter(
              (em) => em.id === e.id
            )[0];
            const control = this.skills
              .at(idxSkill)
              .get('employees') as FormArray;
            control.at(idxEmployee)['controls']['employee'].setValue(employee);
            this.onEmployeeSelect(employee, idxSkill, idxEmployee);
            control
              .at(idxEmployee)
            ['controls']['hoursPerSkill'].setValue(e.hoursPerSkill);
            this.onHoursSelect(e.hoursPerSkill, idxSkill, idxEmployee);
          });
        }
      });
    }
  }

  onManTargetSelect(): void {
    const target = this.projectForm.get('managementTarget').value;
    const hours = this.projectForm.get('managementHours').value;
    if (target < hours) {
      this.projectForm.get('managementTarget').reset();
      this.notificationService.error(
        `You tried to allocate ${hours} hours, but the target is ${target}`
      );
    }
  }

  onManHoursSelect(hours: number): void {
    this.managementHours = hours;
    const target = this.projectForm.get('managementTarget').value;
    if (target < this.managementHours) {
      this.managementHours = 0;
      this.projectForm.get('managementHours').reset();
      this.notificationService.error(
        `You tried to allocate ${hours} hours, but the target is ${target}`
      );
    }
  }

  manHoursDisabled(hour: number): boolean {
    return (
      hour >
      this.loggedUser.availableHours +
      (this.currentProject.managementHours || 0)
    );
  }

  getSkilledEmployees(skill: string, idxSkill: number): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    control.controls.forEach((c, idxEmployee) => {
      const employee = { ...c['controls']['employee'].value };
      if (Object.keys(employee).length !== 0) {
        this.updateHoursMap(idxSkill, idxEmployee, control);
      }
    });
    this.employeesListFiltered[
      idxSkill
    ] = this.employeesList.filter((employee) =>
      employee.skills.includes(skill)
    );
    this.selectedEmployeesList[idxSkill] = [];
    control.reset();
  }

  onTargetSelect(idxSkill: number): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    const sum = control.controls.reduce((acc, e) => {
      acc += e['controls']['hoursPerSkill'].value;
      return acc;
    }, 0);
    const target = this.skills.at(idxSkill).get('targetInHours').value;
    if (target < sum) {
      this.skills.at(idxSkill).get('targetInHours').reset();
      this.notificationService.error(
        `You tried to allocate a total of ${sum} hours to this skill, but the target is ${target}`
      );
    }
  }

  canAddEmployee(idxSkill: number): boolean {
    return (
      this.skills.at(idxSkill).get('skill').invalid ||
      this.skills.at(idxSkill).get('targetInHours').invalid ||
      this.skills.at(idxSkill).get('targetInHours').value < 1
    );
  }

  onEmployeeSelect(
    selectedEmployee: EmployeeDTO,
    idxSkill: number,
    idxEmployee: number
  ): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    this.updateHoursMap(idxSkill, idxEmployee, control);
    control.at(idxEmployee)['controls']['hoursPerSkill'].reset();
    // if (control.at(idxEmployee)['controls']['employee'].length) {
    //   this.updateHoursMap(idxSkill, idxEmployee, control);
    // }
    this.selectedEmployeesList[idxSkill][idxEmployee] = selectedEmployee;
    if (!this.hoursPerEmployeeMap.has(selectedEmployee)) {
      this.hoursPerEmployeeMap.set(selectedEmployee, 0);
    }
    // console.log(this.selectedEmployeesList);
  }

  canAlocateHours(idxSkill: number, idxEmployee: number): boolean {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    return control.at(idxEmployee)['controls']['employee'].valid;
  }

  getHoursPrev(idxSkill: number, idxEmployee: number): number {
    this.hoursHelper = +this.hoursPrev.toArray()[
      this.findQueryIndex(idxSkill, idxEmployee)
    ].triggerValue;
    // console.log('LAST', this.hoursHelper);
    return this.hoursHelper;
  }

  onHoursSelect(hours: number, idxSkill: number, idxEmployee: number): void {
    // console.log('ACTUAL', this.selectedEmployeesList[idxSkill][idxEmployee].availableHours);
    this.hoursPerEmployeeMap.set(
      this.selectedEmployeesList[idxSkill][idxEmployee],
      this.hoursPerEmployeeMap.get(
        this.selectedEmployeesList[idxSkill][idxEmployee]
      ) +
      hours -
      this.hoursHelper
    );
    // console.log('MAP: ', this.hoursPerEmployeeMap.get(this.selectedEmployeesList[idxSkill][idxEmployee]));

    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    const sum = control.controls.reduce((acc, e) => {
      acc += e['controls']['hoursPerSkill'].value;
      return acc;
    }, 0);
    const target = this.skills.at(idxSkill).get('targetInHours').value;
    if (target < sum) {
      this.updateHoursMap(idxSkill, idxEmployee, control);
      control.at(idxEmployee)['controls']['hoursPerSkill'].reset();
      this.notificationService.error(
        `You tried to allocate a total of ${sum} hours to this skill, but the target is ${target}`
      );
    }
  }

  hoursDisabled(idxSkill: number, idxEmployee: number, hour: number): boolean {
    return (
      hour >
      this.selectedEmployeesList[idxSkill][idxEmployee].availableHours -
      this.hoursPerEmployeeMap.get(
        this.selectedEmployeesList[idxSkill][idxEmployee]
      ) +
      this.hoursHelper
    );
  }

  onApply(form: FormGroup): void {
    // console.log(this.selectedEmployeesList);
    form.markAllAsTouched();
    if (form.invalid) {
      this.notificationService.error('Please fill in all required fields!');
      return;
    }

    this.showChart = this.ganttService.shouldDisplayChart(form);
    if (this.showChart === 1) {
      let startDate: Date;
      let endDate: Date;
      let skills: {
        skill: string;
        startDate: Date;
        endDate: Date;
        completeness: { amount: number; fill: boolean };
      }[];
      ({ startDate, endDate, skills } = this.dataFormatter.formToChartData(
        form,
        this.currentProject
      ));
      setTimeout(() => {
        this.ganttService.drawGantt(
          this.chartEl.nativeElement,
          form.get('name').value,
          startDate,
          endDate,
          skills
        );
      }, 100);
    }
    this.canSubmit = true;
  }

  onSubmit(form: FormGroup): void {
    // console.log(form);
    this.dialogRef.close(form);
  }

  private onFormChanges(form: any): void {
    this.skillsListD = form.skills.reduce((acc, skill) => {
      acc.push(skill.skill);
      return acc;
    }, []);
  }

  private findQueryIndex(idxSkill: number, idxEmployee: number): number {
    let count = 0;
    for (let i = 0; i <= idxSkill; i++) {
      if (i !== idxSkill) {
        count += this.selectedEmployeesList[i].reduce((acc, e) => {
          if (e !== undefined) {
            acc++;
          }
          return acc;
        }, 0);
      } else {
        for (let j = 0; j < idxEmployee; j++) {
          if (this.selectedEmployeesList[i][j] !== undefined) {
            count++;
          }
        }
      }
    }

    return count;
  }

  private updateHoursMap(
    idxSkill: number,
    idxEmployee: number,
    control: FormArray
  ): void {
    this.hoursPerEmployeeMap.set(
      this.selectedEmployeesList[idxSkill][idxEmployee],
      this.hoursPerEmployeeMap.get(
        this.selectedEmployeesList[idxSkill][idxEmployee]
      ) - control.at(idxEmployee)['controls']['hoursPerSkill'].value
    );
  }
}
