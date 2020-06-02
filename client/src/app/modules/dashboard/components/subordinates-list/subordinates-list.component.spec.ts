import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubordinatesListComponent } from './subordinates-list.component';

describe('SubordinatesListComponent', () => {
  let component: SubordinatesListComponent;
  let fixture: ComponentFixture<SubordinatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubordinatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubordinatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
