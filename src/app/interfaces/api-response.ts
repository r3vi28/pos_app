export interface ApiResponse<T> {
    success: boolean;
    Mensaje: string;
    datos: T;
    status: number;
}

export interface ApiResponsePaginada<T> extends ApiResponse<T> {
    maxPages: number;
    currentPage: number;
    previous: boolean;
    next: boolean;
}