import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BudgetDetails, BudgetSetupInput } from '../constants/interface';
import { map, Observable } from 'rxjs';
import { FETCH_BUDGET_DETAILS_FOR_EXISTING_USER, SETUP_BUDGET_NEW_USER, CREATE_NEW_BUDGET_CYCLE } from '../graphql/graphqlQueries';

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

  fetchBudgetDetailsForExistingUser(id: number): Observable<BudgetDetails> {
    console.log('Fetching budget details for user ID:', id);
    return this.apollo.query<{fetchBudgetDetailsForExistingUser: BudgetDetails}>({
      query: FETCH_BUDGET_DETAILS_FOR_EXISTING_USER,
      variables: {
        id: id
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => {
        console.log('GraphQL response:', result);
        return result.data!.fetchBudgetDetailsForExistingUser;
      })
    );
  }
  
  createNewBudgetCycle(currentBudgetId: number, newBudgetInput: BudgetSetupInput): Observable<BudgetDetails> {
    return this.apollo.mutate<{updateIsActiveForCurrentBudgetCycle: BudgetDetails}>({
      mutation: CREATE_NEW_BUDGET_CYCLE,
      variables: {
        currentBudgetId: currentBudgetId,
        budgetSetUpInput: newBudgetInput  // Match backend: capital U
      }
    }).pipe(map(result => result.data!.updateIsActiveForCurrentBudgetCycle));
  }
}
