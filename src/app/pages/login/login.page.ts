import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
  ],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    if (!this.username || !this.password) {
      await this.mostrarToast('Complete todos los campos.', 'warning');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: async () => {
        await this.router.navigate(['/productos']);
      },
      error: async () => {
        await this.mostrarToast('Credenciales incorrectas.', 'danger');
      },
    });
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }
}