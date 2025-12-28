import { TestBed } from '@angular/core/testing';

import { DevoteesService } from './devotees.service';

describe('DevoteesService', () => {
  let service: DevoteesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevoteesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
