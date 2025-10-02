import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { BudgetDetails, UserDetails } from '../constants/interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userDetails!: UserDetails;
  private budgetDetails! : BudgetDetails;

  public setUserDetails(userDetails : UserDetails)
  {
      this.userDetails = userDetails;
  }

  public getUserDetails() : UserDetails {
    return this.userDetails;
  }

  public setBudgetDetails(budgetDetails : BudgetDetails) {
    this.budgetDetails = budgetDetails;
  }

  public getBudgetDetails() : BudgetDetails {
    return this.budgetDetails;
  }
}
