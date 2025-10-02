// addUser input object
export interface UserInput {
    name: string;
    userName: string;
    password: string;
}

// Response type from received from backend for addUser query
export interface UserDetails {
    id: number;
    userName: string;
}

// authenticateUser input object
export interface Credentials {
    userName: string;
    password: string;
}

// Budget setup details for new user
export interface BudgetSetupInput {
    id: number;
    startDate: string;
    endDate: string;
    budgetAllocated: number;
    budgetRemaining: number;
}

// Response type from backend for setupBudget query.
export interface BudgetDetails {
    budgetId : number;
    id: number;
    startDate: string;
    endDate: string;
    budgetAllocated: number;
    budgetRemaining: number;
}

export interface TransactionInput {
    id: number;
    transactionAmount: number;
    transactionDate: string;
    transactionCategory: string;
}


