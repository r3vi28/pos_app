import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, { username, password }).pipe(
      tap((response) => {
        sessionStorage.setItem('access', response.access);
        sessionStorage.setItem('refresh', response.refresh);
        sessionStorage.setItem('username', username);
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('access');
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh');
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isAdmin(): boolean {
    return sessionStorage.getItem('rol') === 'Admin';
  }

  setRol(rol: string): void {
    sessionStorage.setItem('rol', rol);
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/perfil/`);
  }
}