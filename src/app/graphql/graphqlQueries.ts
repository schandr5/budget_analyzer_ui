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

export const SETUP_BUDGET_NEW_USER = gql `
    mutation setBudget($budgetSetupInput: BudgetSetupInput!) {
        setupBudgetForNewUser(budgetSetupInput : $budgetSetupInput) {
            budget_id
            id
            start_date
            end_date
            budget_allocated
            budget_remaining        
        }    
    }
`;