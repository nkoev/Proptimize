import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsMemoComponent } from './credentials-memo.component';

describe('CredentialsMemoComponent', () => {
  let component: CredentialsMemoComponent;
  let fixture: ComponentFixture<CredentialsMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredentialsMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialsMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
