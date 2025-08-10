import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { BudgetSetupInput, UserDetails } from '../../constants/interface';
import { Observable, filter } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetSetupService } from '../../services/budget-setup.service';
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

  constructor(private sharedService: SharedService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private budgetSetupService: BudgetSetupService) {
        this.budgetForm = this.fb.group({
          budget_allocated: [null, [Validators.required, Validators.min(0)]],
          start_date: [null, Validators.required],
          end_date: [null, Validators.required],
          budget_remaining: [{ value: 0, disabled: true }]
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

  get budget_allocated() {
     return this.budgetForm.get('budget_allocated');
  }

  get start_date() { 
    return this.budgetForm.get('start_date');  
  }

  get end_date() { 
    return this.budgetForm.get('end_date');
  }

  get budgetRemaining() { 
    return this.budgetForm.get('budget_remaining');
  }

  endAfterStartValidator(group: any) {
    const s = group.get('start_date')?.value;
    const e = group.get('end_date')?.value;
    if (!s || !e) return null;
    return new Date(e).getTime() < new Date(s).getTime() ? { dateRange: true } : null;
  }


  onSubmit() {
     if (this.budgetForm.invalid) {
       return;
     }

     let budgetInput = this.buildBudgetInput();
     console.log(budgetInput);
     this.budgetSetupService.setupBudgetForNewUser(budgetInput).subscribe((result : any) => {
        console.log('Successfully added budegt details for the new user: ', result.budget_id);
     })

  }

  buildBudgetInput() : BudgetSetupInput {
      const budgetAllocated = Number(this.budgetForm.get('budget_allocated')!.value) || 0;
      const budgetRemaining = this.isNewUser ? budgetAllocated : Number(this.budgetForm.get('budget_remaining')!.value) || 0;

      return { 
        id: this.sharedService.getUserDetails().id,
        start_date: moment(this.budgetForm.get('start_date')?.value).format('YYYY-MM-DD'),
        end_date: moment(this.budgetForm.get('end_date')?.value).format('YYYY-MM-DD'),
        budget_allocated: budgetAllocated,
        budget_remaining: budgetRemaining
      };
  }
}