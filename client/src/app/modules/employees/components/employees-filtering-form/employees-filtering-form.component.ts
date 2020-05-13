import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employees-filtering-form',
  templateUrl: './employees-filtering-form.component.html',
  styleUrls: ['./employees-filtering-form.component.css'],
})
export class EmployeesFilteringFormComponent implements OnInit {
  @Input() skillsList: string[];
  @Output() filterEvent = new EventEmitter<any>();
  filteringForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filteringForm = this.fb.group({
      skills: null,
      firstName: null,
      lastName: null,
      subordinates: false,
    });
    this.filterEventListener();
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

  private filterEventListener() {
    this.filteringForm.valueChanges.subscribe((form) => {
      this.filterEvent.next(form);
    });
  }

  clearForm() {
    this.filteringForm.reset();
  }
}
