import { of } from 'rxjs';

export class FirestoreMock {
  public mockCollection;
  public mockWhere;
  public mockOrderBy;
  public mockAdd;
  public mockGet;
  public mockSet;
  public mockUpdate;
  public mockDoc;
  public mockValueChanges;
  public mockSnapshotChanges;
  public mockOnSnapshot;
  public mockRef;

  /* tslint:disable */
  public _mockAddReturn;
  public _mockGetReturn;
  public _mockSetReturn;
  public _mockUpdateReturn;
  public _mockOnSnapshotSuccess;
  public _mockValueChangesReturn;
  public _mockSnapshotChangesReturn;
  /* tslint:enable */

  constructor() {
    // mocked methods and properties that return the class
    this.mockCollection = jest.fn(() => this);
    this.mockWhere = jest.fn(() => this);
    this.mockOrderBy = jest.fn(() => this);
    this.mockDoc = jest.fn(() => this);
    this.mockRef = this;

    // methods that return promises
    this.mockAdd = jest.fn(() => Promise.resolve(this._mockAddReturn));
    this.mockGet = jest.fn(() => Promise.resolve(this._mockGetReturn));
    this.mockSet = jest.fn(() => Promise.resolve(this._mockSetReturn));
    this.mockUpdate = jest.fn(() => Promise.resolve(this._mockUpdateReturn));

    // methods that return observables
    this.mockValueChanges = jest.fn(() => of(this._mockValueChangesReturn));
    this.mockSnapshotChanges = jest.fn(() => of(this._mockSnapshotChangesReturn));

    // methods that accepts callbacks
    this.mockOnSnapshot = jest.fn((success, error) =>
      success(this._mockOnSnapshotSuccess)
    );

    // return values
    this._mockAddReturn = null;
    this._mockGetReturn = null;
    this._mockOnSnapshotSuccess = null;
    this._mockValueChangesReturn = null;
    this._mockSnapshotChangesReturn = [];
  }

  collection(c: string) {
    return this.mockCollection(c);
  }

  valueChanges(...args) {
    return this.mockValueChanges(...args);
  }

  snapshotChanges(...args) {
    return this.mockSnapshotChanges(...args);
  }

  where(...args) {
    return this.mockWhere(...args);
  }

  orderBy(...args) {
    return this.mockOrderBy(...args);
  }

  doc(...args) {
    return this.mockDoc(...args);
  }

  add(a) {
    return this.mockAdd(a);
  }

  get() {
    return this.mockGet();
  }

  set(...args) {
    return this.mockSet(...args);
  }

  update(...args) {
    return this.mockUpdate(...args);
  }

  onSnapshot(success, error) {
    return this.mockOnSnapshot(success, error);
  }

  get ref() {
    return this.mockRef;
  }

  set mockAddReturn(val) {
    this._mockAddReturn = val;
  }

  set mockGetReturn(val) {
    this._mockGetReturn = val;
  }

  set mockSetReturn(val) {
    this._mockSetReturn = val;
  }

  set mockUpdateReturn(val) {
    this._mockUpdateReturn = val;
  }

  set mockOnSnaptshotSuccess(val) {
    this._mockOnSnapshotSuccess = val;
  }

  set mockValueChangesReturn(val) {
    this._mockValueChangesReturn = val;
  }

  set mockSnapshotChangesReturn(val) {
    this._mockSnapshotChangesReturn = val;
  }

  // reset() {
  //   // reset all the mocked returns
  //   this._mockAddReturn = null;
  //   this._mockGetReturn = null;
  //   this._mockOnSnapshotSuccess = null;
  //   this.mockValueChangesReturn = null;

  //   // reset all the mocked functions
  //   this.mockCollection.mockClear();
  //   this.mockWhere.mockClear();
  //   this.mockOrderBy.mockClear();
  //   this.mockAdd.mockClear();
  //   this.mockGet.mockClear();
  //   this.mockValueChanges.mockClear();
  // }
}
