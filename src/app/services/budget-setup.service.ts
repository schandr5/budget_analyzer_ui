import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BudgetDetails, BudgetSetupInput } from '../constants/interface';
import { map, Observable } from 'rxjs';
import { SETUP_BUDGET_NEW_USER } from '../graphql/graphqlQueries';

@Injectable({
  providedIn: 'root'
})
export class BudgetSetupService {

  constructor(private readonly apollo: Apollo) { }

  setupBudgetForNewUser(budgetSetupInput: BudgetSetupInput) : Observable<BudgetDetails> {
    console.log(budgetSetupInput);
    return this.apollo.mutate<{setupBudgetForNewUser: BudgetDetails}>({
        mutation: SETUP_BUDGET_NEW_USER,
        variables: {
          budgetSetupInput: budgetSetupInput
        }
    }).pipe(map(result => result.data!.setupBudgetForNewUser));

  }
}
