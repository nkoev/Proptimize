import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AllEmployeesComponent } from './all-employees.component';
import { EmployeeService } from '../../services/employee.service';
import { UserService } from '../../services/user.service';
import { SkillService } from 'src/app/modules/skills/skill.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleChartsModule } from 'angular-google-charts';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('AllEmployeesComponent', () => {
  let component: AllEmployeesComponent;
  let fixture: ComponentFixture<AllEmployeesComponent>;
  let mockMatDialog: any;
  let mockEmployeeService: any;
  let mockUserService: any;
  let mockSkillService: any;
  let mockRoute: any;
  let mockAuth: any;

  beforeEach(async(() => {
    mockUserService = { allUsers: jest.fn(() => of(['test user'])) };
    mockEmployeeService = {
      allEmployees: jest.fn(() => of(['test employee'])),
    };
    mockRoute = {
      data: of({ loggedUser: 'test user' }),
      queryParams: of({ employee: 'test employee', isManager: true }),
    };
    mockAuth = { loggedUser$: of('test user') };
    mockSkillService = {
      getSkills: jest.fn(() => of(['test skill'])),
    };
    mockMatDialog = {};
    window['google'] = {
      load: jest.fn(),
      charts: { load: jest.fn() },
    } as any;
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), GoogleChartsModule],
      declarations: [AllEmployeesComponent],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: UserService, useValue: mockUserService },
        { provide: SkillService, useValue: mockSkillService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AuthService, useValue: mockAuth },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
