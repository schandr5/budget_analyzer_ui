import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UserDetails, TransactionInput } from '../../constants/interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import moment from 'moment';
    
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
  transactions: TransactionInput[] = [];
  budgetRemaining: number = 0;
  budgetAllocated: number = 0;
  
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
    private fb: FormBuilder
  ) {
    this.userDetails = this.sharedService.getUserDetails();
    
    this.transactionForm = this.fb.group({
      transactionDate: [null, Validators.required],
      transactionCategory: ['', Validators.required],
      transactionAmount: [null, [Validators.required, Validators.min(0.01)]]
    });

    const budgetDetails = this.sharedService.getBudgetDetails();
    console.log('Budget details: ' + budgetDetails);
    if (budgetDetails) {
      this.budgetRemaining = budgetDetails.budgetRemaining;
      this.budgetAllocated = budgetDetails.budgetAllocated;
    }
  }

  ngOnInit() {
    this.transactionForm.patchValue({
      transactionDate: moment().format('YYYY-MM-DD')
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
      id: this.userDetails.id,
      transactionDate: moment(this.transactionForm.get('transactionDate')?.value).format('YYYY-MM-DD'),
      transactionCategory: this.transactionForm.get('transactionCategory')?.value,
      transactionAmount: Number(this.transactionForm.get('transactionAmount')?.value)
    };

    this.transactions.unshift(newTransaction);
    
    this.budgetRemaining -= newTransaction.transactionAmount;

    this.transactionForm.reset({
      transactionDate: moment().format('YYYY-MM-DD'),
      transactionCategory: '',
      transactionAmount: null
    });

    console.log('Transaction added:', newTransaction);
  }

  getTotalSpent(): number {
    return this.transactions.reduce((sum, transaction) => sum + transaction.transactionAmount, 0);
  }

  formatDate(dateString: string): string {
    return moment(dateString).format('MMM DD, YYYY');
  }
}
