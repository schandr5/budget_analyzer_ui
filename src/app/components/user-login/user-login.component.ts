import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BudgetSetupService } from '../../services/budget.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})

export class UserLoginComponent {
  fb = inject(FormBuilder);
  loginForm: FormGroup = this.fb.group({ 
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private userService: UserService,
    private sharedService: SharedService,
    private budgetSetupService: BudgetSetupService,
    private router : Router) {  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      console.log('Trying to login user');
      this.userService.loginUser(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('User login completed successfully: ' + res.userName);
          this.sharedService.setUserDetails(res);
          this.budgetSetupService.fetchBudgetDetailsForExistingUser(res.userId).subscribe({
            next: (budgetRes) => {
              console.log('Budget details fetched successfully:', budgetRes);
              if (budgetRes) {
                this.sharedService.setBudgetDetails(budgetRes);
              } else {
                console.log('Budget details are null/undefined');
              }
              this.router.navigate(['/add-transaction']);
            },
            error: (err) => {
              console.error('Failed to fetch budget details:', err);
            }
          });
        },
        error: (err) => {
          console.log('User login failed');
        }
      });
    }
  }
}