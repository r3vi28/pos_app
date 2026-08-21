import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage),
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.page').then((m) => m.ClientesPage),
    canActivate: [authGuard],
  },
  {
    path: 'ventas',
    loadComponent: () => import('./pages/ventas/ventas.page').then((m) => m.VentasPage),
    canActivate: [authGuard],
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then((m) => m.ConfiguracionPage),
    canActivate: [authGuard],
  },
];
