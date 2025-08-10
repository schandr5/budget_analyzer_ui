import { TestBed } from '@angular/core/testing';

import { BudgetSetupService } from './budget-setup.service';

describe('BudgetSetupService', () => {
  let service: BudgetSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
