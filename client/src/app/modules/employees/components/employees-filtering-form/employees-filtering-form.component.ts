import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employees-filtering-form',
  templateUrl: './employees-filtering-form.component.html',
  styleUrls: ['./employees-filtering-form.component.css'],
})
export class EmployeesFilteringFormComponent implements OnInit, OnDestroy {
  @Input() skillsList: string[];
  @Output() filterEvent = new EventEmitter<any>();
  filteringForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filteringForm = this.fb.group({
      skills: null,
      firstName: null,
      lastName: null,
      subordinates: false,
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
  get firstName() {
    return this.filteringForm.get('firstName');
  }
  get lastName() {
    return this.filteringForm.get('lastName');
  }
  get subordinates() {
    return this.filteringForm.get('subordinates');
  }

  setSkillsField(skill: string): void {
    this.filteringForm.patchValue({ skills: [skill] });
  }

  clearForm(): void {
    this.filteringForm.reset();
  }
}
