import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';
import { ApiResponse, ApiResponsePaginada } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getProductos(page: number = 1, pagesize: number = 10): Observable<ApiResponsePaginada<Producto[]>> {
    return this.http.get<ApiResponsePaginada<Producto[]>>(
      `${this.apiUrl}/productos/?page=${page}&pagesize=${pagesize}`
    );
  }

  getProducto(id: number): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.apiUrl}/productos/${id}/`);
  }

  crearProducto(producto: Partial<Producto>): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(`${this.apiUrl}/productos/`, producto);
  }

  actualizarProducto(id: number, producto: Partial<Producto>): Observable<ApiResponse<Producto>> {
    return this.http.put<ApiResponse<Producto>>(`${this.apiUrl}/productos/${id}/`, producto);
  }

  eliminarProducto(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/productos/${id}/`);
  }
}