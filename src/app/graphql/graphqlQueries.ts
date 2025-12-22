import { gql } from 'apollo-angular';

// Mutation for registration of new user
export const CREATE_USER = gql`
    mutation createUser($newUser: UserInput!) {
        addUser(newUser: $newUser) {
            userId
            userName
        }    
    }
`;

// Query for user login
export const LOGIN_USER = gql`
    query loginUser($credentials: Credentials!) {
        authenticateUser(credentials: $credentials) {
            userId
            userName        
        }    
    }
`;

// Mutation to setup budget for new user
export const SETUP_BUDGET_NEW_USER = gql `
    mutation setBudget($budgetSetupInput: BudgetSetupInput!) {
        setupBudgetForNewUser(budgetSetupInput : $budgetSetupInput) {
            budgetId
            userId
            startDate
            endDate
            budgetAllocated
            budgetRemaining
            isActive
        }    
    }
`;

// Query to fetch budget details for existing user
export const FETCH_BUDGET_DETAILS_FOR_EXISTING_USER = gql`
    query fetchBudgetDetails($id: ID!) {
        fetchBudgetDetailsForExistingUser(id: $id) {
            budgetId
            userId
            startDate
            endDate
            budgetAllocated
            budgetRemaining
            isActive
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
                budgetRemaining       
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
            userId
            startDate
            endDate
            budgetAllocated
            budgetRemaining
            isActive
        }
    }
`;

// Mutation to create new budget cycle (deactivates current and creates new)
export const MODIFY_EXISTING_BUDGET_CYCLE_WITHIN_CURRENT_CYCLE = gql`
    mutation modifyBudgetForExistingCycle($currentBudgetId: ID!, $additionalBudgetAllocated: Long!) {
        modifyBudgetForExistingCycle(currentBudgetId: $currentBudgetId, additionalBudgetAllocated: $additionalBudgetAllocated) {
            budgetId
            userId
            startDate
            endDate
            budgetAllocated
            budgetRemaining
            isActive
        }
    }
`;