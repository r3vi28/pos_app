import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonMenuToggle,
  ],
})
export class AppComponent implements OnInit {
  mostrarMenu: boolean = false;
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.mostrarMenu = this.authService.isAuthenticated() && !event.url.includes('/login');
      this.username = this.authService.getUsername() || '';
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout() {
    this.authService.logout();
  }
}