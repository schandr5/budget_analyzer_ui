import { gql } from 'apollo-angular';

// Query for registration of new user
export const CREATE_USER = gql`
    mutation createUser($newUser: UserInput!) {
        addUser(newUser: $newUser) {
            id
            name
        }    
    }
`;

// Query for user login
export const LOGIN_USER = gql`
    query loginUser($credentials: Credentials!) {
        authenticateUser(credentials: $credentials) {
            id
            name        
        }    
    }
`;