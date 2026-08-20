import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonButtons,
  IonModal,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { ClientesService } from '../../services/clientes';
import { AuthService } from '../../services/auth';
import { Cliente } from '../../interfaces/cliente';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonButtons,
    IonModal,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonToggle,
  ],
})
export class ClientesPage implements OnInit {
  clientes: Cliente[] = [];
  currentPage: number = 1;
  maxPages: number = 1;
  previous: boolean = false;
  next: boolean = false;

  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  clienteSeleccionado: Partial<Cliente> = {};

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  async cargarClientes() {
    this.clientesService.getClientes(this.currentPage).subscribe({
      next: (res) => {
        this.clientes = [...res.datos];
        this.maxPages = res.maxPages;
        this.previous = res.previous;
        this.next = res.next;
      },
      error: async () => {
        await this.mostrarToast('Error al cargar los clientes.', 'danger');
      },
    });
  }

  paginaAnterior() {
    if (this.previous) {
      this.currentPage--;
      this.cargarClientes();
    }
  }

  paginaSiguiente() {
    if (this.next) {
      this.currentPage++;
      this.cargarClientes();
    }
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.clienteSeleccionado = { have_rnc: false };
    this.modalAbierto = true;
  }

  abrirModalEditar(cliente: Cliente) {
    this.modoEdicion = true;
    this.clienteSeleccionado = { ...cliente };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.clienteSeleccionado = {};
  }

  validarRncInput(event: any) {
    const input = event.target as HTMLIonInputElement;
    const valor = (input.value || '').toString().replace(/[^0-9]/g, '');
    input.value = valor;
    this.clienteSeleccionado.rnc = valor;
  }

  guardarCliente() {
    if (this.clienteSeleccionado.have_rnc) {
      const rnc = (this.clienteSeleccionado.rnc || '').toString();
      if (rnc.length < 9 || rnc.length > 11) {
        this.mostrarToast('El RNC debe tener entre 9 y 11 dígitos.', 'danger');
        return;
      }
    }
    if (this.modoEdicion && this.clienteSeleccionado.id) {
      this.clientesService
        .actualizarCliente(
          this.clienteSeleccionado.id,
          this.clienteSeleccionado
        )
        .subscribe({
          next: async (res) => {
            if (res.success === true || (res.success as any) === 'true') {
              await this.mostrarToast(
                'Cliente actualizado correctamente.',
                'success'
              );
              this.cerrarModal();
              this.cargarClientes();
            } else {
              const mensaje = this.extraerMensajeError({ error: res });
              await this.mostrarToast(mensaje, 'danger');
            }
          },
          error: async (err) => {
            const mensaje = this.extraerMensajeError(err);
            await this.mostrarToast(mensaje, 'danger');
          },
        });
    } else {
      this.clientesService.crearCliente(this.clienteSeleccionado).subscribe({
        next: async (res) => {
          if (res.success === true || (res.success as any) === 'true') {
            await this.mostrarToast('Cliente creado correctamente.', 'success');
            this.cerrarModal();
            this.cargarClientes();
          } else {
            const mensaje = this.extraerMensajeError({ error: res });
            await this.mostrarToast(mensaje, 'danger');
          }
        },
        error: async (err) => {
          const mensaje = this.extraerMensajeError(err);
          await this.mostrarToast(mensaje, 'danger');
        },
      });
    }
  }

  async confirmarEliminar(cliente: Cliente) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar a "${cliente.nombre} ${cliente.apellido}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarCliente(cliente.id);
          },
        },
      ],
    });
    await alert.present();
  }

  eliminarCliente(id: number) {
    this.clientesService.eliminarCliente(id).subscribe({
      next: async (res) => {
        if (res.success === true || (res.success as any) === 'true') {
          await this.mostrarToast(
            'Cliente eliminado correctamente.',
            'success'
          );
          this.currentPage = 1;
          await this.cargarClientes();
        } else {
          await this.mostrarToast(
            'No se puede eliminar este cliente porque tiene ventas asociadas.',
            'danger'
          );
        }
      },
      error: async () => {
        await this.mostrarToast(
          'No se puede eliminar este cliente porque tiene ventas asociadas.',
          'danger'
        );
      },
    });
  }

  private extraerMensajeError(err: any): string {
    const errores = err.error?.Mensaje;
    const campos: { [key: string]: string } = {
      nombre: 'nombre',
      apellido: 'apellido',
      email: 'email',
      telefono: 'teléfono',
      direccion: 'dirección',
      have_rnc: 'RNC',
      rnc: 'RNC',
    };
    if (errores && typeof errores === 'object') {
      return Object.entries(errores)
        .map(([campo, msgs]: [string, any]) => {
          const nombreCampo = campos[campo];
          const msg = Array.isArray(msgs) ? msgs[0] : msgs;
          if (nombreCampo) {
            return `El campo ${nombreCampo} es requerido.`;
          }
          return msg;
        })
        .join(' ');
    }
    if (typeof errores === 'string') {
      return errores;
    }
    return 'Error al procesar la solicitud.';
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
