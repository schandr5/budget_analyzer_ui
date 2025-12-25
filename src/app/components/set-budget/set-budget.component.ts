import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { BudgetDetails, BudgetSetupInput, UserDetails } from '../../constants/interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetSetupService } from '../../services/budget.service';
import { BudgetModalComponent } from '../budget-modal/budget-modal.component';
import { TransactionService } from '../../services/transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BUDGET_PLANNER } from '../../constants/budget-planner.constants';
import moment from 'moment';

@Component({
  selector: 'app-set-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './set-budget.component.html',
  styleUrl: './set-budget.component.css'
})
export class SetBudgetComponent implements OnInit, OnDestroy {

  budgetForm: FormGroup;  
  isNewUser: boolean = false;
  isModifyingExisting: boolean = false;
  currentBudget: number = 0;
  totalSpent: number = 0;
  minStartDate: string = '';
  
  // Expose planner labels to template
  planner = BUDGET_PLANNER;
  
  private destroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private budgetSetupService: BudgetSetupService,
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {
    this.budgetForm = this.fb.group({
      budgetAllocated: [null, [Validators.required, Validators.min(0)]],
      additionalBudget: [null, [Validators.min(0)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      budgetRemaining: [{ value: 0, disabled: true }]
    },
    { validators: [this.endAfterStartValidator] });
    
    this.setupDynamicCalculations();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      
      if (params.isNewUser) {
        this.isNewUser = params.isNewUser;
      }
      
      // Check if coming from transaction page and user has existing budget
      if (params.fromTransaction === 'true') {
        const existingBudget = this.sharedService.getBudgetDetails();
        if (existingBudget) {
          this.openBudgetDialog();
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupDynamicCalculations() {
    // Listen to additional budget changes for existing cycle modification
    this.budgetForm.get('additionalBudget')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(additionalAmount => {
        if (this.isModifyingExisting) {
          const newTotal = this.currentBudget + (Number(additionalAmount) || 0);
          const newRemaining = newTotal - this.totalSpent;
          
          this.budgetForm.patchValue({
            budgetAllocated: newTotal,
            budgetRemaining: newRemaining
          }, { emitEvent: false });
        }
      });

    // Listen to budget allocated changes for new cycle
    this.budgetForm.get('budgetAllocated')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(allocated => {
        if (!this.isModifyingExisting && this.isNewUser) {
          this.budgetForm.patchValue({
            budgetRemaining: allocated
          }, { emitEvent: false });
        }
      });
  }

  openBudgetDialog() {
    const dialogRef = this.dialog.open(BudgetModalComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((modifyExisting: boolean) => {
      if (modifyExisting !== undefined) {
        this.handleBudgetChoice(modifyExisting);
      }
    });
  }

  handleBudgetChoice(modifyExisting: boolean) {
    const existingBudget = this.sharedService.getBudgetDetails();
    
    if (modifyExisting && existingBudget) {
      this.isModifyingExisting = true;
      this.currentBudget = existingBudget.budgetAllocated;
      
      // Fetch transactions to calculate total spent
      this.transactionService.retrieveTransations(existingBudget.budgetId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(transactions => {
          this.totalSpent = transactions.reduce((sum, t) => sum + t.transactionAmount, 0);
          
          // Setup form for modification
          this.budgetForm.patchValue({
            budgetAllocated: this.currentBudget,
            startDate: existingBudget.startDate,
            endDate: existingBudget.endDate,
            budgetRemaining: this.currentBudget - this.totalSpent,
            additionalBudget: 0
          });
          
          // Only disable date fields (budgetAllocated stays enabled for display)
          this.budgetForm.get('startDate')?.disable();
          this.budgetForm.get('endDate')?.disable();
          
          // Enable additional budget field
          this.budgetForm.get('additionalBudget')?.enable();
          this.budgetForm.get('additionalBudget')?.setValidators([Validators.required, Validators.min(0)]);
        });
    } else {
      // Create new budget cycle
      this.isModifyingExisting = false;
      this.budgetForm.get('startDate')?.enable();
      this.budgetForm.get('endDate')?.enable();
      this.budgetForm.get('budgetAllocated')?.enable();
      this.budgetForm.get('additionalBudget')?.disable();
      this.budgetForm.get('additionalBudget')?.clearValidators();
      
      // Set minimum start date to day after current cycle ends
      if (existingBudget && existingBudget.endDate) {
        const currentEndDate = new Date(existingBudget.endDate);
        currentEndDate.setDate(currentEndDate.getDate() + 1); // Day after current cycle ends
        this.minStartDate = moment(currentEndDate).format('YYYY-MM-DD');
      } else {
        // If no existing budget, allow any date (for new users)
        this.minStartDate = '';
      }
    }
  }

  get budgetAllocated() {
     return this.budgetForm.get('budgetAllocated');
  }

  get startDate() { 
    return this.budgetForm.get('startDate');  
  }

  get endDate() { 
    return this.budgetForm.get('endDate');
  }

  get budgetRemaining() { 
    return this.budgetForm.get('budgetRemaining');
  }

  endAfterStartValidator(group: any) {
    const s = group.get('startDate')?.value;
    const e = group.get('endDate')?.value;
    if (!s || !e) return null;
    return new Date(e).getTime() < new Date(s).getTime() ? { dateRange: true } : null;
  }


  onSubmit() {
     if (this.budgetForm.invalid) {
       return;
     }

     let budgetInput = this.buildBudgetInput();

     if (this.isModifyingExisting) {
       const currentBudgetId = this.sharedService.getBudgetDetails().budgetId;
       const additionalBudget = Number(this.budgetForm.get('additionalBudget')?.value) || 0;
       this.budgetSetupService.modifyExistingBudgetCycleWithinCurrentCycle(currentBudgetId, additionalBudget).subscribe((result : any) => {
          this.handleBudgetSuccess(result, 'Successfully updated budget: ');
       });
     } else if (this.sharedService.getBudgetDetails()) {
      const currentBudgetId = this.sharedService.getBudgetDetails().budgetId;
       this.budgetSetupService.createNewBudgetCycle(currentBudgetId, budgetInput).subscribe((result : any) => {
          this.handleBudgetSuccess(result, 'Successfully created new budget cycle: ');
       });
     } else {
       this.budgetSetupService.setupBudgetForNewUser(budgetInput).subscribe((result : any) => {
          this.handleBudgetSuccess(result, 'Successfully added budget details for new user: ');
       });
     }
  }

  buildBudgetInput(): BudgetSetupInput {
      const budgetAllocated = Number(this.budgetForm.get('budgetAllocated')!.value) || 0;
      
      const budgetRemaining = this.isModifyingExisting 
        ? budgetAllocated - this.totalSpent 
        : budgetAllocated;                  

      return { 
        user_id: this.sharedService.getUserDetails().userId,
        startDate: moment(this.budgetForm.get('startDate')?.value).format('YYYY-MM-DD'),
        endDate: moment(this.budgetForm.get('endDate')?.value).format('YYYY-MM-DD'),
        budgetAllocated: budgetAllocated,
        budgetRemaining: budgetRemaining
      };
  }

  calculateDays(): number {
    const startDate = this.budgetForm.get('startDate')?.value;
    const endDate = this.budgetForm.get('endDate')?.value;
    
    if (!startDate || !endDate) {
      return 0;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff : 0;
  }

  private handleBudgetSuccess(result: BudgetDetails, successMessage: string): void {
    this.sharedService.setBudgetDetails(result);
    console.log(successMessage, result.budgetId);
    this.router.navigate(['/add-transaction'], { queryParams: { budgetSetup: 'true' } });
  }
}