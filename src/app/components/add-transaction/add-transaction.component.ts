import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UserDetails, TransactionInput, BudgetDetails, TransactionOutput } from '../../constants/interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { TransactionService } from '../../services/transaction.service';
    
@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent implements OnInit {

  private userDetails! : UserDetails;
  transactionForm: FormGroup;
  transactions: TransactionOutput[] = [];
  budgetRemaining: number = 0;
  budgetAllocated: number = 0;
  private budgetDetails! : BudgetDetails;
  
  categories: string[] = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Education',
    'Misc'
  ];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.userDetails = this.sharedService.getUserDetails();
    
    this.transactionForm = this.fb.group({
      transactionDate: [null, Validators.required],
      transactionCategory: ['', Validators.required],
      transactionAmount: [null, [Validators.required, Validators.min(0.01)]]
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

    this.transactionService.retrieveTransations(this.budgetDetails.budgetId).subscribe({
      next: (res) => {
        this.transactions = res;
        const totalSpent = this.getTotalSpent();
        this.budgetRemaining = this.budgetAllocated - totalSpent;
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
}
