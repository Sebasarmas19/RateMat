import { TestBed } from '@angular/core/testing';

import { ProfessorProfileService } from './professor-profile.service';

describe('ProfessorProfileService', () => {
  let service: ProfessorProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessorProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
