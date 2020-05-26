import { Component, OnInit, Inject, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { GanttService } from '../../services/gantt.service';

interface ProjectDialogData {
  skillsList: string[];
  employeesList: Observable<any[]>;
}

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  @ViewChildren('sl3') hoursPrev: QueryList<MatSelect>;
  @ViewChild('charts') public chartEl: ElementRef;
  projectForm: FormGroup;
  skillsList: string[];
  skillsListD: string[] = [];
  employeesListData: Observable<any[]>;
  employeesList: any[] = [];
  employeesListFiltered: any[] = [];
  selectedEmployeesList: any[] = [];
  hours = Array(8).fill(0).map((_, i) => i + 1);
  hoursPerEmployeeMap: Map<any, number> = new Map<any, number>();
  hoursHelper = 0;
  showChart: 1 | 2 | 3 = 1;
  canSubmit = false;

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData,
    private fb: FormBuilder,
    private readonly ganttService: GanttService
  ) {
    dialogRef.disableClose = true;
    this.skillsList = this.data.skillsList;
    this.employeesListData = this.data.employeesList;
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(20)]],
      description: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      targetInDays: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      skills: this.fb.array([]),
    });

    this.employeesListData.subscribe(data => {
      this.employeesList = data.filter(employee => employee.availableHours >= 1);
      console.log(this.employeesList);
    });

    this.projectForm.valueChanges.subscribe((form) => this.onFormChanges(form));
  }

  get skills() {
    return this.projectForm.get('skills') as FormArray;
  }

  private newSkill(): FormGroup {
    return this.fb.group({
      skill: [null, [Validators.required]],
      targetInHours: [null, [Validators.required, , Validators.min(0), Validators.max(1000)]],
      employees: this.fb.array([]),
    });
  }

  private newEmployee(): FormGroup {
    return this.fb.group({
      employee: [null, [Validators.required]],
      hoursPerSkill: [null, [Validators.required]],
    });
  }

  addSkill(event: MouseEvent): void {
    this.skills.push(this.newSkill());
    event.preventDefault();

    this.selectedEmployeesList[this.skills.length - 1] = [];
  }

  addEmployee(event: MouseEvent, idxSkill: number): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    control.push(this.newEmployee());
    event.preventDefault();
  }

  removeSkill(idxSkill: number, event: MouseEvent) {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    control.controls.forEach((c, idxEmployee) => {
      const employee = { ...c['controls']['employee'].value }
      if (Object.keys(employee).length !== 0) {
        this.updateHoursMap(idxSkill, idxEmployee, control);
      }
    });
    this.skills.removeAt(idxSkill);
    this.employeesListFiltered.splice(idxSkill, 1);
    this.selectedEmployeesList.splice(idxSkill, 1);
    event.preventDefault();
  }

  removeEmployee(idxSkill: number, idxEmployee: number) {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    this.updateHoursMap(idxSkill, idxEmployee, control);
    control.removeAt(idxEmployee);
    this.selectedEmployeesList[idxSkill].splice(idxEmployee, 1);
  }

  canAddEmployee(idxSkill: number): boolean {
    return this.skills.at(idxSkill).get('skill').invalid
      || this.skills.at(idxSkill).get('targetInHours').invalid
      || this.skills.at(idxSkill).get('targetInHours').value < 1
  }

  onApply(form: FormGroup): void {
    form.markAllAsTouched();
    if (form.invalid) {
      window.alert('INVALID FORM');
      return;
    }

    this.showChart = this.ganttService.shouldDisplayChart(form);
    if (this.ganttService.shouldDisplayChart(form) === 2) {
      this.showChart === 2;
    } else if (this.ganttService.shouldDisplayChart(form) === 3) {
      this.showChart === 3;
    }
    else {
      let endDate: Date;
      let skills: { skill: string, endDate: Date, completeness: { amount: number, fill: boolean } }[];
      ({ endDate, skills } = this.ganttService.formToChartData(form));
      this.ganttService.drawGantt(this.chartEl.nativeElement, form.get('name').value, endDate, skills);
    }
    this.canSubmit = true;
  }

  onSubmit(form: FormGroup): void {
    console.log(form);
  }

  onFormChanges(form: any): void {
    this.skillsListD = form.skills.reduce((acc, skill) => {
      acc.push(skill.skill);
      return acc;
    }, []);
  }

  getSkilledEmployees(skill: string, idxSkill: number): void {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    control.controls.forEach((c, idxEmployee) => {
      const employee = { ...c['controls']['employee'].value }
      if (Object.keys(employee).length !== 0) {
        this.updateHoursMap(idxSkill, idxEmployee, control);
      }
    });
    this.employeesListFiltered[idxSkill] = this.employeesList.filter(employee => employee.skills.includes(skill));
    this.selectedEmployeesList[idxSkill] = [];
    control.reset();
  }

  onEmployeeSelect(selectedEmployee: any, idxSkill: number, idxEmployee: number): void {

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

  onHoursSelect(hours: number, idxSkill: number, idxEmployee: number): void {
    // console.log('ACTUAL', this.selectedEmployeesList[idxSkill][idxEmployee].availableHours);
    this.hoursPerEmployeeMap.set(this.selectedEmployeesList[idxSkill][idxEmployee],
      this.hoursPerEmployeeMap.get(this.selectedEmployeesList[idxSkill][idxEmployee]) + hours - this.hoursHelper);
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
      window.alert(`You tried to allocate a total of ${sum} hours to this skill, but the target is ${target}`);
    }
  }

  canAlocateHours(idxSkill: number, idxEmployee: number) {
    const control = this.skills.at(idxSkill).get('employees') as FormArray;
    return control.at(idxEmployee)['controls']['employee'].valid;
  }

  getHoursPrev(idxSkill: number, idxEmployee: number) {
    this.hoursHelper = +this.hoursPrev.toArray()[this.findQueryIndex(idxSkill, idxEmployee)].triggerValue;
    // console.log('LAST', this.hoursHelper);
    return this.hoursHelper;
  }

  hoursDisabled(idxSkill: number, idxEmployee: number, hour: number) {
    return hour > this.selectedEmployeesList[idxSkill][idxEmployee].availableHours
      - this.hoursPerEmployeeMap.get(this.selectedEmployeesList[idxSkill][idxEmployee]) + this.hoursHelper;
  }

  private findQueryIndex(idxSkill: number, idxEmployee: number): number {
    let count = 0;
    for (let i = 0; i <= idxSkill; i++) {
      if (i !== idxSkill) {
        count += this.selectedEmployeesList[i].reduce((acc, e) => {
          if (e !== undefined) { acc++; }
          return acc;
        }, 0);
      } else {
        for (let j = 0; j < idxEmployee; j++) {
          if (this.selectedEmployeesList[i][j] !== undefined) { count++; }
        }
      }
    }

    return count;
  }

  private updateHoursMap(idxSkill: number, idxEmployee: number, control: FormArray) {
    this.hoursPerEmployeeMap.set(this.selectedEmployeesList[idxSkill][idxEmployee],
      this.hoursPerEmployeeMap.get(this.selectedEmployeesList[idxSkill][idxEmployee])
      - control.at(idxEmployee)['controls']['hoursPerSkill'].value);
  }


}
