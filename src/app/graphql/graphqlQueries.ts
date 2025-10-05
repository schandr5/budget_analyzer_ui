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
    query fetchBudgetDetails($id: ID!) {
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

// Mutation to add a transaction
export const ADD_TRANSACTION = gql`
    mutation addNewTransaction($transactionInput: TransactionInput!) {
        addTransaction(transactionInput: $transactionInput) {
                transactionId
                budgetId
                transactionAmount
                transactionDate
                transactionCategory
                transactionPriority       
        }
    }
`;

// Query to retrieve transactions for a budget
export const RETRIEVE_TRANSACTIONS = gql`
    query retrieveUserTransactions($budgetId: ID!) {
        fetchTransactions(budgetId: $budgetId) {
            transactionId
            budgetId
            transactionAmount
            transactionDate
            transactionCategory
            transactionPriority    
        }    
    }
`;

// Mutation to create new budget cycle (deactivates current and creates new)
export const CREATE_NEW_BUDGET_CYCLE = gql`
    mutation updateIsActiveForCurrentBudgetCycle($currentBudgetId: ID!, $budgetSetUpInput: BudgetSetupInput!) {
        updateIsActiveForCurrentBudgetCycle(currentBudgetId: $currentBudgetId, budgetSetUpInput: $budgetSetUpInput) {
            budgetId
            id
            startDate
            endDate
            budgetAllocated
            budgetRemaining
        }
    }
`;