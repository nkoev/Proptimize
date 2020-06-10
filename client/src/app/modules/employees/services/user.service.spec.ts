import { TestBed, async } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { FirestoreMock } from 'src/test-helpers/firestore-mock';
import { of } from 'rxjs';
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

describe('UserService', () => {
  let service: any;
  let afsMock: FirestoreMock;
  let afAuthMock: any;
  let httpMock: any;

  beforeEach(() => {
    jest.clearAllMocks();

    afsMock = new FirestoreMock();
    httpMock = {
      post: jest.fn(() => of({ email: 'test email', uid: 'testId' })),
    };
    afAuthMock = { sendPasswordResetEmail: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFirestore, useValue: afsMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: HttpClient, useValue: httpMock },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(afsMock.mockCollection).toHaveBeenCalledWith('users');
  });

  describe('AllUsers()', () => {
    it('should call Users collection valueChanges method', (done) => {
      service.allUsers().subscribe(() => {
        expect(afsMock.mockValueChanges).toHaveBeenCalled();
        done();
      });
    });

    it('should emit correct value from valueChanges method', (done) => {
      afsMock.mockValueChangesReturn = 'user changes';
      service.allUsers().subscribe((res: string) => {
        expect(res).toEqual('user changes');
        done();
      });
    });
  });

  describe('queryUsers()', () => {
    it('should call Users collection where method with correct arguments', () => {
      afsMock.mockGetReturn = {
        docs: [{ data: () => ({ name: 'test user' }), id: 'testId' }],
      };
      service.queryUsers('name', 'test');
      expect(afsMock.mockWhere).toHaveBeenCalledWith('name', '==', 'test');
    });

    it('call Users collection get method', async(() => {
      afsMock.mockGetReturn = {
        docs: [{ data: () => ({ name: 'test user' }), id: 'testId' }],
      };
      service.queryUsers('testId').then((res) => {
        expect(afsMock.mockGet).toHaveBeenCalled();
      });
    }));

    it('should return the result from Users collection get method', async(() => {
      afsMock.mockGetReturn = {
        docs: [{ data: () => ({ name: 'test user' }), id: 'testId' }],
      };
      service
        .queryUsers('name', 'test')
        .then((res: { name: string; id: string }) => {
          expect(res).toEqual([{ name: 'test user', id: 'testId' }]);
        });
    }));
  });

  describe('getUserById() should', () => {
    it('call the correct doc reference', async(() => {
      afsMock.mockGetReturn = {
        data: () => ({ name: 'test user' }),
        id: 'testId',
      };
      service.getUserById('testId').then(() => {
        expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
      });
    }));

    it('call the doc reference get method', async(() => {
      afsMock.mockGetReturn = {
        data: () => ({ name: 'test user' }),
        id: 'testId',
      };
      service.getUserById('testId').then((res) => {
        expect(afsMock.mockGet).toHaveBeenCalled();
      });
    }));

    it('return correct value', async(() => {
      afsMock.mockGetReturn = {
        data: () => ({ name: 'test user' }),
        id: 'testId',
      };
      service.getUserById('testId').then((res) => {
        expect(res).toEqual({ name: 'test user', id: 'testId' });
      });
    }));
  });

  describe('updateUser() should', () => {
    it('call the correct doc reference.', () => {
      service.updateUser('testId');
      expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('call the doc reference update method with correct data', () => {
      service.updateUser('testId', 'test data');
      expect(afsMock.mockUpdate).toHaveBeenCalledWith('test data');
    });

    it('return the result from update method', async(() => {
      afsMock.mockUpdateReturn = 'user updated';
      service.updateUser('testId').then((res) => {
        expect(res).toEqual('user updated');
      });
    }));
  });

  describe('registerUser() should', () => {
    it('call the HttpClient post method', () => {
      service.registerUser({ email: 'test email' });
      expect(httpMock.post).toHaveBeenCalled();
    });

    it('call the AngularFireAuth sendPasswordResetEmail method with correct email', (done) => {
      service.registerUser({ email: 'test email' }).subscribe(() => {
        expect(afAuthMock.sendPasswordResetEmail).toHaveBeenCalledWith(
          'test email'
        );
        done();
      });
    });

    it('create doc reference with correct id', (done) => {
      service.registerUser({ email: 'test email' }).subscribe(() => {
        expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
        done();
      });
    });

    it('set user doc with correct data', (done) => {
      service.registerUser({ email: 'test email' }).subscribe(() => {
        expect(afsMock.mockSet).toHaveBeenCalledWith({
          email: 'test email',
          id: 'testId',
        });
        done();
      });
    });

    it('return the result from set method', (done) => {
      afsMock.mockSetReturn = 'set user';
      service.registerUser({ email: 'test email' }).subscribe((res) => {
        expect(res).toEqual('set user');
        done();
      });
    });
  });

  describe('addProject method', () => {
    it('should call users collection.doc() with correct argument', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.addProject('testId', projectStub);
      expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('should call firestore increment method with negative dailyInputs sum', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.addProject('testId', projectStub);
      expect(firestore.FieldValue.increment).toHaveBeenCalledWith(-5);
    });

    it('should call firestore arrayUnion method with correct argument', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.addProject('testId', projectStub);
      expect(firestore.FieldValue.arrayUnion).toHaveBeenCalledWith(projectStub);
    });

    it('should call users collection update method with correct arguments.', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.addProject('testId', projectStub);
      expect(afsMock.mockUpdate).toHaveBeenCalledWith({
        projects: [projectStub],
        availableHours: -5,
      });
    });
  });

  describe('removeProject method', () => {
    it('should call users collection.doc() with correct argument.', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.removeProject('testId', projectStub);
      expect(afsMock.mockDoc).toHaveBeenCalledWith('testId');
    });

    it('should call firestore increment method with dailyInputs sum', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.removeProject('testId', projectStub);
      expect(firestore.FieldValue.increment).toHaveBeenCalledWith(5);
    });

    it('should call firestore arrayRemove method with correct argument', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.removeProject('testId', projectStub);
      expect(firestore.FieldValue.arrayRemove).toHaveBeenCalledWith(
        projectStub
      );
    });

    it('should call users collection.update method with correct arguments.', () => {
      const projectStub = { dailyInput: [{ hours: 5 }] };
      service.removeProject('testId', projectStub);
      expect(afsMock.mockUpdate).toHaveBeenCalledWith({
        projects: [projectStub],
        availableHours: 5,
      });
    });
  });
});
