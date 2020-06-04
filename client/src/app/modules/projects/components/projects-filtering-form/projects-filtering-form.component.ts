import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProjectStatusType } from 'src/app/models/projects/project-status.type';

@Component({
  selector: 'app-projects-filtering-form',
  templateUrl: './projects-filtering-form.component.html',
  styleUrls: ['./projects-filtering-form.component.css']
})
export class ProjectsFilteringFormComponent implements OnInit, OnDestroy {

  @Input() skillsList: string[];
  @Output() filterEvent = new EventEmitter<{
    skills: string[],
    status: string[],
    name: string,
    reporter: string,
    myProjects: boolean
  }>();
  filteringForm: FormGroup;
  private subscriptions: Subscription[] = [];
  selectedSkills: string[];
  selectedStatus: string[];
  statusList = Object.keys(ProjectStatusType).map(k => ProjectStatusType[k as any]);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filteringForm = this.fb.group({
      skills: null,
      status: null,
      name: null,
      reporter: null,
      myProjects: false,
    });
    const sub1 = this.filteringForm.valueChanges.subscribe((form) => {
      this.filterEvent.next(form);
    });
    this.subscriptions.push(sub1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get skills() {
    return this.filteringForm.get('skills');
  }
  get status() {
    return this.filteringForm.get('status');
  }
  get name() {
    return this.filteringForm.get('name');
  }
  get reporter() {
    return this.filteringForm.get('reporter');
  }
  get myProjects() {
    return this.filteringForm.get('myProjects');
  }

  clearForm() {
    this.filteringForm.reset();
  }

  clearSkills() {
    this.skills.reset();
    this.selectedSkills = undefined;
  }

  clearStatus() {
    this.status.reset();
    this.selectedStatus = undefined;
  }

}
