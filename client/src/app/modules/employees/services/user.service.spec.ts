import { TestBed, async } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';

describe('UserService', () => {
  let service: any;
  let afsMock: any;
  let afAuthMock: any;
  let collectionStub: any;
  let httpMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    collectionStub = { valueChanges: () => of('test') };
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

  describe('AllUsers$', () => {
    it('should call Users collection valueChanges method', () => {
      service.allUsers$.subscribe(() => {
        expect(afsMock.collection.valueChanges).toHaveBeenCalled();
      });
    });

    it('should emit correct value from AngularFirestore.collection.valueChanges', () => {
      jest
        .spyOn(afsMock, 'collection')
        .mockImplementation(() => ({ valueChanges: () => of('All users') }));
      service.allUsers().subscribe((res) => {
        expect(res).toEqual('All users');
      });
    });
  });
  // describe('queryUsers', () => {
  //   it('should call AngularFirestore.collection.where.get', () => {
  //     service.queryUsers('name', 'test').then((res) => {
  //       expect(afs.collection.valueChanges()).toHaveBeenCalled();
  //       expect(res).toEqual({ foo: 'bar' } as any);
  //     });
  //   });
  // });
});
