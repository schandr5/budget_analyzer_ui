import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { FETCH_AI_INSIGHTS } from '../graphql/graphqlQueries';


@Injectable({
  providedIn: 'root'
})
export class InsightsService {

  constructor(private readonly apollo: Apollo) { }

  fetchAiInsights(budgetId: number, prompt: string): Observable<string> {
    return this.apollo.query<{ fetchInsights: string }>({
      query: FETCH_AI_INSIGHTS,
      variables: { budgetId, prompt },
      fetchPolicy: 'network-only',
    }).pipe(map(res => res.data.fetchInsights));
  }
}
