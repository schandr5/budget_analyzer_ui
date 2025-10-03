import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { BudgetDetails, BudgetSetupInput, UserDetails } from '../../constants/interface';
import { Observable, filter } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetSetupService } from '../../services/budget.service';
import moment from 'moment';

@Component({
  selector: 'app-set-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './set-budget.component.html',
  styleUrl: './set-budget.component.css'
})
export class SetBudgetComponent {

  private userDetails! : UserDetails;
  budgetForm: FormGroup;  
  isNewUser: boolean = false;
  private budgetDetails! : BudgetDetails;

  constructor(private sharedService: SharedService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private budgetSetupService: BudgetSetupService) {
    this.budgetForm = this.fb.group({
      budgetAllocated: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      budgetRemaining: [{ value: 0, disabled: true }]
    },
   { validators: [this.endAfterStartValidator] });
    }

  ngOnInit() {
    this.route.queryParams.pipe(filter((params: any) => params.isNewUser))
                          .subscribe((params: any) => {
                            console.log(params);
                            this.isNewUser = params.isNewUser;
    })
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
     this.budgetSetupService.setupBudgetForNewUser(budgetInput).subscribe((result : any) => {
        this.budgetDetails = result;
        console.log('Successfully added budget details for the new user: ', result.budgetId);
     })

  }

  buildBudgetInput() : BudgetSetupInput {
      const budgetAllocated = Number(this.budgetForm.get('budgetAllocated')!.value) || 0;
      const budgetRemaining = this.isNewUser ? budgetAllocated : Number(this.budgetForm.get('budgetRemaining')!.value) || 0;

      return { 
        id: this.sharedService.getUserDetails().id,
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
}