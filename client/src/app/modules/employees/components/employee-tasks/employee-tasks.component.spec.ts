import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTasksComponent } from './employee-tasks.component';

describe('EmployeeTasksComponent', () => {
  let component: EmployeeTasksComponent;
  let fixture: ComponentFixture<EmployeeTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
