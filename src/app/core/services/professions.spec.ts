import { TestBed } from '@angular/core/testing';

import { Professions } from './professions';

describe('Professions', () => {
  let service: Professions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Professions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
