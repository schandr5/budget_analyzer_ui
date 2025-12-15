// TransactionPriority enum matching backend schema
export enum TransactionPriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

// addUser input object
export interface UserInput {
    name: string;
    userName: string;
    password: string;
}

// Response type from received from backend for addUser query
export interface UserDetails {
    userId: number;
    userName: string;
}

// authenticateUser input object
export interface Credentials {
    userName: string;
    password: string;
}

// Budget setup details for new user
export interface BudgetSetupInput {
    user_id: number;
    startDate: string;
    endDate: string;
    budgetAllocated: number;
    budgetRemaining: number;
}

// Response type from backend for setupBudget query.
export interface BudgetDetails {
    budgetId : number;
    userId: number;
    startDate: string;
    endDate: string;
    budgetAllocated: number;
    budgetRemaining: number;
    isActive: boolean;
}

export interface TransactionInput {
    budgetId: number;
    transactionAmount: number;
    transactionDate: string;
    transactionCategory: string;
    budgetAllocated: number;
}

export interface TransactionOutput {
    transactionId: number;
    budgetId: number;
    transactionAmount: number;
    transactionDate: string;
    transactionCategory: string;
    transactionPriority: TransactionPriority;
}