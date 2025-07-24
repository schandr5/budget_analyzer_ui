import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CREATE_USER, LOGIN_USER } from '../graphql/graphqlQueries';
import { Credentials, UserDetails, UserInput } from '../constants/interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly apollo : Apollo) { }

  // Method to createUser on UserRegistration
  createUser(newUser: UserInput): Observable<UserDetails> {
      return this.apollo.mutate<{addUser: UserDetails}>({
        mutation: CREATE_USER,
        variables: {
          newUser: newUser
        }
      }).pipe(map(result => result.data!.addUser));
  };

  // Method to authenticate and help the user login.
  loginUser(credentials: Credentials): Observable<UserDetails> {
      return this.apollo.query<{authenticateUser: UserDetails}>({
        query: LOGIN_USER,
        variables: {
          credentials: credentials
        },
        fetchPolicy: 'no-cache'
      }).pipe(map(result => result.data!.authenticateUser));
  };
}

