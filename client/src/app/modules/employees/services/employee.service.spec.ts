import { TestBed, async } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { FirestoreMock } from 'src/test-helpers/firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

jest.mock('firebase/app', () => ({
  firestore: { FieldValue: { arrayUnion: jest.fn((...args) => args) } },
}));

describe('EmployeeServiceService', () => {
  let service: EmployeeService;
  let firestoreMock: FirestoreMock;

  beforeEach(() => {
    jest.clearAllMocks();
    firestoreMock = new FirestoreMock();
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        { provide: AngularFirestore, useValue: firestoreMock },
      ],
    });
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(firestoreMock.mockCollection).toHaveBeenCalledWith('employees');
  });

  describe('allEmployees method', () => {
    it('should call employees collection valueChanges method', (done) => {
      service.allEmployees().subscribe(() => {
        expect(firestoreMock.mockValueChanges).toHaveBeenCalled();
        done();
      });
    });

    it('should retreive idField as id from valueChanges method', (done) => {
      service.allEmployees().subscribe(() => {
        expect(firestoreMock.mockValueChanges).toHaveBeenCalledWith({
          idField: 'id',
        });
        done();
      });
    });

    it('should emit correct value from employees collection valueChanges method', (done) => {
      firestoreMock.mockValueChangesReturn = { data: 'all employees' };
      service.allEmployees().subscribe((res) => {
        console.log(res);
        expect(res).toEqual({ data: 'all employees' } as any);
        done();
      });
    });
  });

  describe('queryEmployees method', () => {
    it('should call employees collection ref where method with correct arguments', async(() => {
      firestoreMock.mockGetReturn = {
        docs: [{ data: () => 'test data' }],
      };
      service.queryEmployees('testField', 'testValue').then(() => {
        expect(firestoreMock.mockWhere).toHaveBeenCalledWith(
          'testField',
          '==',
          'testValue'
        );
      });
    }));

    it('should call employees collection ref where get method with correct arguments', async(() => {
      firestoreMock.mockGetReturn = {
        docs: [{ data: () => 'test data', id: 'testId' }],
      };
      service.queryEmployees('testField', 'testValue').then(() => {
        expect(firestoreMock.mockGet).toHaveBeenCalled();
      });
    }));

    it('should return correct data from get method and attach id', async(() => {
      firestoreMock.mockGetReturn = {
        docs: [{ data: () => ({ data: 'test' }), id: 'testId' }],
      };
      service.queryEmployees('testField', 'testValue').then((res) => {
        expect(res).toEqual([{ data: 'test', id: 'testId' }] as any);
      });
    }));
  });

  describe('getEmployeeById', () => {
    it('should call employees collection doc method with correct arguments', async(() => {
      firestoreMock.mockGetReturn = { data: () => 'test data' };
      service.getEmployeeById('testId').then(() => {
        expect(firestoreMock.mockDoc).toHaveBeenCalledWith('testId');
      });
    }));

    it('should call employees collection doc ref get method', async(() => {
      firestoreMock.mockGetReturn = { data: () => 'test data' };
      service.getEmployeeById('testId').then(() => {
        expect(firestoreMock.mockGet).toHaveBeenCalled();
      });
    }));

    it('should return correct data and attach id', async(() => {
      firestoreMock.mockGetReturn = {
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
      firestoreMock.mockAddReturn = 'employee added';
      service.addEmployee('test employee' as any).then(() => {
        expect(firestoreMock.mockAdd).toHaveBeenCalledWith('test employee');
      });
    }));

    it('should return correct value from add method', async(() => {
      firestoreMock.mockAddReturn = 'employee added';
      service.addEmployee('test employee' as any).then((res) => {
        expect(res).toEqual('employee added');
      });
    }));
  });

  describe('addSkillsToEmployee method', () => {
    it('should call employees collection.doc() with correct arguments', () => {
      firestoreMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId');
      expect(firestoreMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('should call firestore arrayUnion method with correct arguments', () => {
      firestoreMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId');
      expect(firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(
        'test skill'
      );
    });

    it('should call employees collection update with correct arguments', () => {
      firestoreMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId');
      expect(firestoreMock.mockUpdate).toHaveBeenCalledWith({
        skills: ['test skill'],
      });
    });

    it('should return correct value from update method', async(() => {
      firestoreMock.mockUpdateReturn = 'employee updated';
      service.addSkillsToEmployee(['test skill'], 'testId').then((res) => {
        expect(res).toEqual('employee updated');
      });
    }));
  });

  describe('addEmployee method', () => {});
});
