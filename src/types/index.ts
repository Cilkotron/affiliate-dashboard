export interface User {
    id: number;
    email: string;
    role: 'admin' | 'affiliate';
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}