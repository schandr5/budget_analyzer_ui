import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { TransactionInput, TransactionOutput } from '../constants/interface';
import { map, Observable } from 'rxjs';
import { ADD_TRANSACTION, RETRIEVE_TRANSACTIONS } from '../graphql/graphqlQueries';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private readonly apollo: Apollo) { }

  addTransaction(transactionInput: TransactionInput): Observable<TransactionOutput> {
    return this.apollo.mutate<{addTransaction: TransactionOutput}>({
      mutation: ADD_TRANSACTION,
      variables: {
        transactionInput: transactionInput
      },
      refetchQueries: [
        {
          query: RETRIEVE_TRANSACTIONS,
          variables: {
            budgetId: transactionInput.budgetId
          }
        }
      ]
    }).pipe(map(result => result.data!.addTransaction));
  }

  retrieveTransations(budgetId: number) : Observable<TransactionOutput[]>{
    return this.apollo.watchQuery<{fetchTransactions: TransactionOutput[]}> ({
      query: RETRIEVE_TRANSACTIONS,
      variables: {
        budgetId: budgetId
      },
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(map(result => result.data.fetchTransactions));
  }
}
