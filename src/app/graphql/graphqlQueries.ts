import { gql } from 'apollo-angular';

// Mutation for registration of new user
export const CREATE_USER = gql`
    mutation createUser($newUser: UserInput!) {
        addUser(newUser: $newUser) {
            id
            userName
        }    
    }
`;

// Query for user login
export const LOGIN_USER = gql`
    query loginUser($credentials: Credentials!) {
        authenticateUser(credentials: $credentials) {
            id
            userName        
        }    
    }
`;

// Mutation to setup budget for new user
export const SETUP_BUDGET_NEW_USER = gql `
    mutation setBudget($budgetSetupInput: BudgetSetupInput!) {
        setupBudgetForNewUser(budgetSetupInput : $budgetSetupInput) {
            budgetId
            id
            startDate
            endDate
            budgetAllocated
            budgetRemaining
        }    
    }
`;

// Query to fetch budget details for existing user
export const FETCH_BUDGET_DETAILS_FOR_EXISTING_USER = gql`
    query fetcheBudgetDetails($id: ID!) {
        fetchBudgetDetailsForExistingUser(id: $id) {
            budgetId
            id
            startDate
            endDate
            budgetAllocated
            budgetRemaining
        }
    }
`;