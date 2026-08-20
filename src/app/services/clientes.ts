import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';
import { ApiResponse, ApiResponsePaginada } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getClientes(page: number = 1, pagesize: number = 10): Observable<ApiResponsePaginada<Cliente[]>> {
    return this.http.get<ApiResponsePaginada<Cliente[]>>(
      `${this.apiUrl}/clientes/?page=${page}&pagesize=${pagesize}`
    );
  }

  getCliente(id: number): Observable<ApiResponse<Cliente>> {
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/clientes/${id}/`);
  }

  crearCliente(cliente: Partial<Cliente>): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(`${this.apiUrl}/clientes/`, cliente);
  }

  actualizarCliente(id: number, cliente: Partial<Cliente>): Observable<ApiResponse<Cliente>> {
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/clientes/${id}/`, cliente);
  }

  eliminarCliente(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/clientes/${id}/`);
  }
}