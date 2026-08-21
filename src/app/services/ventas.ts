import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaCreateRequest } from '../interfaces/venta';
import { ApiResponse, ApiResponsePaginada } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getVentas(
    page: number = 1,
    pagesize: number = 10
  ): Observable<ApiResponsePaginada<Venta[]>> {
    return this.http.get<ApiResponsePaginada<Venta[]>>(
      `${this.apiUrl}/ventas/?page=${page}&pagesize=${pagesize}`
    );
  }

  getVenta(id: number): Observable<ApiResponse<Venta>> {
    return this.http.get<ApiResponse<Venta>>(`${this.apiUrl}/ventas/${id}/`);
  }

  createVenta(data: VentaCreateRequest): Observable<ApiResponse<Venta>> {
    return this.http.post<ApiResponse<Venta>>(`${this.apiUrl}/ventas/`, data);
  }

  deleteVenta(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}/ventas/${id}/`);
  }
}
