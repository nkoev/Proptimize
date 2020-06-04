import { TestBed, async } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let afs: any;
  let afAuth: any;
  let http: any;

  beforeEach(async(() => {
    afs = {
      collection: () => ({
        doc: () => ({
          valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
          set: () => new Promise((resolve, reject) => resolve()),
        }),
      }),
    };
    afAuth = 'ba';
    http = 'ga';
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFirestore, useValue: afs },
        { provide: AngularFireAuth, useValue: afAuth },
        { provide: HttpClient, useValue: http },
      ],
    });
    service = TestBed.inject(UserService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
