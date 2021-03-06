import { TestBed, async } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { FirestoreMock } from 'src/test-helpers/firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

jest.mock('firebase/app', () => ({
  firestore: {
    FieldValue: {
      arrayUnion: jest.fn((...args) => args),
      arrayRemove: jest.fn((...args) => args),
      increment: jest.fn((num) => num),
    },
  },
}));

describe('EmployeeServiceService', () => {
  let service: EmployeeService;
  let afsMock: FirestoreMock;

  beforeEach(() => {
    jest.clearAllMocks();
    afsMock = new FirestoreMock();
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        { provide: AngularFirestore, useValue: afsMock },
      ],
    });
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(afsMock.mockCollection).toHaveBeenCalledWith('employees');
  });

  describe('allEmployees method', () => {
    it('should call employees collection valueChanges method', (done) => {
      service.allEmployees().subscribe(() => {
        expect(afsMock.mockValueChanges).toHaveBeenCalled();
        done();
      });
    });

    it('should retreive idField as id from valueChanges method', (done) => {
      service.allEmployees().subscribe(() => {
        expect(afsMock.mockValueChanges).toHaveBeenCalledWith({
          idField: 'id',
        });
        done();
      });
    });

    it('should emit correct value from employees collection valueChanges method', (done) => {
      afsMock.mockValueChangesReturn = { data: 'all employees' };
      service.allEmployees().subscribe((res) => {
        expect(res).toEqual({ data: 'all employees' } as any);
        done();
      });
    });
  });

  describe('queryEmployees method', () => {
    it('should call employees collection ref where method with correct arguments', async(() => {
      afsMock.mockGetReturn = {
        docs: [{ data: () => 'test data' }],
      };
      service.queryEmployees('testField', 'testValue').then(() => {
        expect(afsMock.mockWhere).toHaveBeenCalledWith(
          'testField',
          '==',
          'testValue'
        );
      });
    }));

    it('should call employees collection ref where get method with correct arguments', async(() => {
      afsMock.mockGetReturn = {
        docs: [{ data: () => 'test data', id: 'testId' }],
      };
      service.queryEmployees('testField', 'testValue').then(() => {
        expect(afsMock.mockGet).toHaveBeenCalled();
      });
    }));

    it('should return correct data from get method and attach id', async(() => {
      afsMock.mockGetReturn = {
        docs: [{ data: () => ({ data: 'test' }), id: 'testId' }],
      };
      service.queryEmployees('testField', 'testValue').then((res) => {
        expect(res).toEqual([{ data: 'test', id: 'testId' }] as any);
      });
    }));
  });

  describe('getEmployeeById', () => {
    it('should call employees collection doc method with correct arguments', async(() => {
      afsMock.mockGetReturn = { data: () => 'test data' };
      service.getEmployeeById('testId').then(() => {
        expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
      });
    }));

    it('should call employees collection doc ref get method', async(() => {
      afsMock.mockGetReturn = { data: () => 'test data' };
      service.getEmployeeById('testId').then(() => {
        expect(afsMock.mockGet).toHaveBeenCalled();
      });
    }));

    it('should return correct data and attach id', async(() => {
      afsMock.mockGetReturn = {
        data: () => ({ data: 'test' }),
        id: 'testId',
      };
      service.getEmployeeById('testId').then((res) => {
        expect(res).toEqual({ data: 'test', id: 'testId' } as any);
      });
    }));
  });

  describe('addEmployee method', () => {
    it('should call employees collection add method with correct arguments', async(() => {
      afsMock.mockAddReturn = 'employee added';
      service.addEmployee('test employee' as any).then(() => {
        expect(afsMock.mockAdd).toHaveBeenCalledWith('test employee');
      });
    }));

    it('should return correct value from add method', async(() => {
      afsMock.mockAddReturn = 'employee added';
      service.addEmployee('test employee' as any).then((res) => {
        expect(res).toEqual('employee added');
      });
    }));
  });

  describe('addSkillsToEmployee method', () => {
    it('should call employees collection.doc() with correct arguments', () => {
      afsMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId');
      expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('should call firestore arrayUnion method with correct arguments', () => {
      afsMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId');
      expect(firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(
        'test skill'
      );
    });

    it('should call employees collection update with correct arguments', () => {
      afsMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId');
      expect(afsMock.mockUpdate).toHaveBeenCalledWith({
        skills: ['test skill'],
      });
    });

    it('should return correct value from update method', async(() => {
      afsMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId').then((res) => {
        expect(res).toEqual('employee updated');
      });
    }));
  });

  describe('addProject method', () => {
    it('should call employees collection.doc() with correct argument', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.addProject('testId', projectStub);
      expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('should call firestore increment method with negative dailyInputs sum', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.addProject('testId', projectStub);
      expect(firestore.FieldValue.increment).toHaveBeenCalledWith(-5);
    });

    it('should call firestore arrayUnion method with correct argument', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.addProject('testId', projectStub);
      expect(firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(projectStub);
    });

    it('should call employees collection update method with correct arguments.', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.addProject('testId', projectStub);
      expect(afsMock.mockUpdate).toHaveBeenCalledWith({
        projects: [projectStub],
        availableHours: -5,
      });
    });
  });

  describe('removeProject method', () => {
    it('should call employees collection.doc() with correct argument.', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.removeProject('testId', projectStub);
      expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('should call firestore increment method with dailyInputs sum', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.removeProject('testId', projectStub);
      expect(firestore.FieldValue.increment).toHaveBeenCalledWith(5);
    });

    it('should call firestore arrayRemove method with correct argument', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.removeProject('testId', projectStub);
      expect(firestore.FieldValue.arrayRemove).toHaveBeenCalledWith(
        projectStub
      );
    });

    it('should call employees collection.update method with correct arguments.', () => {
      const projectStub = { dailyInput: [{ hours: 2 }, { hours: 3 }] };
      service.removeProject('testId', projectStub);
      expect(afsMock.mockUpdate).toHaveBeenCalledWith({
        projects: [projectStub],
        availableHours: 5,
      });
    });
  });
});
