import { TestBed } from '@angular/core/testing';

import { LeituraService } from './leitura-service';

describe('LeituraService', () => {
  let service: LeituraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeituraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
