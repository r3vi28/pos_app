export interface Usuario {
    id: number;
    username: string;
    email: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}