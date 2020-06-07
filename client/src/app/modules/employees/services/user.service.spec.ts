import { TestBed, async } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: any;
  let afsMock: any;
  let afAuthMock: any;
  let collectionStub: any;
  let refStub: any;
  let httpMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (refStub = {
      get: jest.fn(
        () =>
          new Promise((resolve) =>
            resolve({
              data: () => ({ name: 'test user' }),
              id: 'testId',
            })
          )
      ),
    }),
      (collectionStub = {
        valueChanges: jest.fn(() => of('users')),
        doc: () => ({
          ref: refStub,
        }),
        ref: {
          where: jest.fn(() => ({
            get: jest.fn(
              () =>
                new Promise((resolve) =>
                  resolve({
                    docs: [
                      { data: () => ({ name: 'test user' }), id: 'testId' },
                    ],
                  })
                )
            ),
          })),
        },
      });
    afsMock = {
      collection: jest.fn(() => collectionStub),
    };
    afAuthMock = 'ba';
    httpMock = 'ga';
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
    expect(afsMock.collection).toHaveBeenCalledWith('users');
  });

  describe('AllUsers()', () => {
    it('should call Users collection valueChanges method', (done) => {
      service.allUsers().subscribe(() => {
        expect(collectionStub.valueChanges).toHaveBeenCalled();
        done();
      });
    });

    it('should emit correct value from Users collection valueChanges method', (done) => {
      service.allUsers().subscribe((res: string) => {
        expect(res).toEqual('users');
        done();
      });
    });
  });

  describe('queryUsers()', () => {
    it('should call AngularFirestore.collection.where with correct arguments', async(() => {
      service.queryUsers('name', 'test').then(() => {
        expect(collectionStub.ref.where).toHaveBeenCalledWith(
          'name',
          '==',
          'test'
        );
      });
    }));

    it('should return correct value from AngularFirestore.collection.where.get', async(() => {
      service
        .queryUsers('name', 'test')
        .then((res: { name: string; id: string }) => {
          expect(res).toEqual([{ name: 'test user', id: 'testId' }]);
        });
    }));
  });

  describe('getUserById()', () => {
    it('should call AngularFirestore.collection.where with correct arguments.', async(() => {
      console.log(collectionStub.doc().ref.get());
      service.getUserById('testId').then((res) => {
        expect(res).toEqual({ name: 'test user', id: 'testId' });
        expect(refStub.get).toHaveBeenCalled();
      });
    }));
  });
});
