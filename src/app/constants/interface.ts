// addUser input object
export interface UserInput {
    name: string;
    userName: string;
    password: string;
}

// Response type from received from backend for addUser query
export interface UserDetails {
    id: number;
    name: string;
}

// authenticateUser input object
export interface Credentials {
    userName: string;
    password: string;
}

// Budget setup details for new user
export interface BudgetSetupInput {
    id: number;
    start_date: string;
    end_date: string;
    budget_allocated: number;
    budget_remaining: number;
}

// Response type from backend for setupBudget query.
export interface BudgetDetails {
    budget_id : number;
    id: number;
    start_date: string;
    end_date: string;
    budget_allocated: number;
    budget_remaining: number;
}


