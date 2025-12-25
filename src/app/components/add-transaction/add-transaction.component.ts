import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UserDetails, TransactionInput, BudgetDetails, TransactionOutput } from '../../constants/interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { TransactionService } from '../../services/transaction.service';
import { TRANSACTION_CATEGORIES } from '../../constants/budget-planner.constants';
    
@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent implements OnInit {

  transactionForm: FormGroup;
  transactions: TransactionOutput[] = [];
  budgetRemaining: number = 0;
  budgetAllocated: number = 0;
  private budgetDetails! : BudgetDetails;
  showBudgetSetupBanner: boolean = false;
  exceedsBudgetWarning: boolean = false;
  
  categories: string[] = TRANSACTION_CATEGORIES;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {
    
    this.transactionForm = this.fb.group({
      transactionDate: [null, Validators.required],
      transactionCategory: ['', Validators.required],
      transactionAmount: [null, [
        Validators.required, 
        Validators.min(0.01),
        this.budgetLimitValidator.bind(this)
      ]]
    });

    // Real-time validation: check budget limit as user types
    this.transactionForm.get('transactionAmount')?.valueChanges.subscribe(value => {
      const amount = Number(value);
      this.exceedsBudgetWarning = amount > 0 && amount > this.budgetRemaining;
    });

    this.budgetDetails = this.sharedService.getBudgetDetails();
    if (this.budgetDetails) {
      this.budgetRemaining = this.budgetDetails.budgetRemaining;
      this.budgetAllocated = this.budgetDetails.budgetAllocated;
    }
  }

  ngOnInit() {
    this.transactionForm.patchValue({
      transactionDate: moment().format('YYYY-MM-DD')
    });

    // Check if coming from budget setup
    this.route.queryParams.subscribe(params => {
      if (params['budgetSetup'] === 'true') {
        this.showBudgetSetupBanner = true;
        setTimeout(() => {
          this.showBudgetSetupBanner = false;
        }, 5000);
      }
    });

    this.transactionService.retrieveTransations(this.budgetDetails.budgetId).subscribe({
      next: (res) => {
        this.transactions = res;
        console.log('Transactions updated:', res);
      },
      error: (err) => {
        console.log('Failed to retrieve transactions', err);
      }
    });
  }

  get transactionDate() {
    return this.transactionForm.get('transactionDate');
  }

  get transactionCategory() {
    return this.transactionForm.get('transactionCategory');
  }

  get transactionAmount() {
    return this.transactionForm.get('transactionAmount');
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      return;
    }

    const newTransaction: TransactionInput = {
      budgetId: this.budgetDetails.budgetId,
      transactionAmount: Number(this.transactionForm.get('transactionAmount')?.value),
      transactionDate: moment(this.transactionForm.get('transactionDate')?.value).format('YYYY-MM-DD'),
      transactionCategory: this.transactionForm.get('transactionCategory')?.value,
      budgetAllocated: this.budgetDetails.budgetAllocated
    };

    this.transactionService.addTransaction(newTransaction).subscribe({
      next: (res) => {
        console.log('Transaction added:', res);
        // Use budgetRemaining from transaction response (backend-calculated)
        this.budgetRemaining = res.budgetRemaining;
        // Update budgetDetails in shared service to keep it in sync
        this.budgetDetails.budgetRemaining = res.budgetRemaining;
        this.sharedService.setBudgetDetails(this.budgetDetails);
        // Reset warning flag and re-validate transaction amount field with new budget remaining
        this.exceedsBudgetWarning = false;
        this.transactionForm.get('transactionAmount')?.updateValueAndValidity();
        this.transactionForm.reset({
          transactionDate: moment().format('YYYY-MM-DD'),
          transactionCategory: '',
          transactionAmount: null
        });
      },
      error: (err) => {
        console.log('Failed to add new transaction', err);
      }
    });
  }

  getTotalSpent(): number {
    return this.transactions.reduce((sum, transaction) => sum + transaction.transactionAmount, 0);
  }

  formatDate(dateString: string): string {
    return moment(dateString).format('MMM DD, YYYY');
  }

  dismissBanner(): void {
    this.showBudgetSetupBanner = false;
  }

  private budgetLimitValidator(control: any): { [key: string]: any } | null {
    const transactionAmount = Number(control?.value);
    if (!transactionAmount || !this.budgetRemaining) {
      return null;
    }
    
    if (transactionAmount > this.budgetRemaining) {
      return { exceedsBudget: true };
    }
    
    return null;
  }
}
