import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBudgetComponent } from './set-budget.component';

describe('SetBudgetComponent', () => {
  let component: SetBudgetComponent;
  let fixture: ComponentFixture<SetBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetBudgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
