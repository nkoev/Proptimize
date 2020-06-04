import { TestBed } from '@angular/core/testing';

import { DataFormatterService } from './data-formatter.service';

describe('DataFormatterService', () => {
  let service: DataFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
