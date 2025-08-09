import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UserDetails } from '../../constants/interface';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private sharedService: SharedService,
    private router: Router,
    private fb: FormBuilder) {
        this.budgetForm = this.fb.group({
          budget_allocated: ['', Validators.required],
          start_date: ['', Validators.required],
          end_date: ['', Validators.required],
          budget_remaining: ['', Validators.required],
        });
    }

  ngOnInit() {
    this.sharedService.getUserDetails().subscribe((data) => {
      this.userDetails = data;
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


  onSubmit() {

  }


}
