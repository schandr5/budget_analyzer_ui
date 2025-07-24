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