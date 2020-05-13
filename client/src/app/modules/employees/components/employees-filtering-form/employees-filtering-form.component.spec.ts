import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesFilteringFormComponent } from './employees-filtering-form.component';

describe('EmployeesFilteringFormComponent', () => {
  let component: EmployeesFilteringFormComponent;
  let fixture: ComponentFixture<EmployeesFilteringFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesFilteringFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesFilteringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
