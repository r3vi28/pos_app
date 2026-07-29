import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
  IonList, IonItem, IonLabel, IonMenuButton, IonButtons,
  IonModal, IonInput, IonGrid, IonRow, IonCol,
  ToastController, AlertController, ModalController,
} from '@ionic/angular/standalone';
import { ProductosService } from '../../services/productos';
import { AuthService } from '../../services/auth';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonList, IonItem, IonLabel, IonMenuButton, IonButtons,
    IonModal, IonInput, IonGrid, IonRow, IonCol,
  ],
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  currentPage: number = 1;
  maxPages: number = 1;
  previous: boolean = false;
  next: boolean = false;

  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  productoSeleccionado: Partial<Producto> = {};

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  async cargarProductos() {
    this.productosService.getProductos(this.currentPage).subscribe({
      next: (res) => {
        this.productos = [...res.datos];
        this.maxPages = res.maxPages;
        this.previous = res.previous;
        this.next = res.next;
      },
      error: async () => {
        await this.mostrarToast('Error al cargar los productos.', 'danger');
      }
    });
  }

  paginaAnterior() {
    if (this.previous) {
      this.currentPage--;
      this.cargarProductos();
    }
  }

  paginaSiguiente() {
    if (this.next) {
      this.currentPage++;
      this.cargarProductos();
    }
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.productoSeleccionado = { have_code: false, stock: 0 };
    this.modalAbierto = true;
  }

  abrirModalEditar(producto: Producto) {
    this.modoEdicion = true;
    this.productoSeleccionado = { ...producto };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.productoSeleccionado = {};
  }

  guardarProducto() {
    if (this.modoEdicion && this.productoSeleccionado.id) {
      this.productosService.actualizarProducto(this.productoSeleccionado.id, this.productoSeleccionado).subscribe({
        next: async () => {
          await this.mostrarToast('Producto actualizado correctamente.', 'success');
          this.cerrarModal();
          this.cargarProductos();
        },
        error: async (err) => {
          const errores = err.error?.Mensaje;
          let mensaje = 'Por favor complete todos los campos correctamente.';
          if (errores && typeof errores === 'object') {
            const campos: { [key: string]: string } = {
              nombre: 'nombre', precio: 'precio', stock: 'stock',
              have_code: 'código de barras', codigo_barra: 'código de barras',
              non_field_errors: ''
            };
            const mensajes = Object.entries(errores)
              .map(([campo, msgs]: [string, any]) => {
                const nombreCampo = campos[campo] || campo;
                const msg = Array.isArray(msgs) ? msgs[0] : msgs;
                return nombreCampo ? `El campo ${nombreCampo} es inválido.` : msg;
              });
            mensaje = mensajes.join(' ');
          }
          await this.mostrarToast(mensaje, 'danger');
        }
      });
    } else {
      this.productosService.crearProducto(this.productoSeleccionado).subscribe({
        next: async (res) => {
          if (res.success) {
            await this.mostrarToast('Producto creado correctamente.', 'success');
            this.cerrarModal();
            this.cargarProductos();
          } else {
            const errores = res.Mensaje;
            let mensaje = 'Por favor complete todos los campos correctamente.';
            if (errores && typeof errores === 'object') {
              const campos: { [key: string]: string } = {
                nombre: 'nombre', precio: 'precio', stock: 'stock',
                have_code: 'código de barras', codigo_barra: 'código de barras',
                non_field_errors: ''
              };
              const mensajes = Object.entries(errores)
                .map(([campo, msgs]: [string, any]) => {
                  const nombreCampo = campos[campo] || campo;
                  const msg = Array.isArray(msgs) ? msgs[0] : msgs;
                  return nombreCampo ? `El campo ${nombreCampo} es requerido.` : msg;
                });
              mensaje = mensajes.join(' ');
            }
            await this.mostrarToast(mensaje, 'danger');
          }
        },
        error: async () => {
          await this.mostrarToast('Error inesperado al crear el producto.', 'danger');
        }
      });
    }
  }

  async confirmarEliminar(producto: Producto) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar "${producto.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarProducto(producto.id);
          }
        }
      ]
    });
    await alert.present();
  }

  eliminarProducto(id: number) {
    this.productosService.eliminarProducto(id).subscribe({
      next: async (res) => {
        if (res.success) {
          await this.mostrarToast('Producto eliminado correctamente.', 'success');
          this.currentPage = 1;
          await this.cargarProductos();
        } else {
          await this.mostrarToast('No se puede eliminar este producto porque tiene ventas asociadas.', 'danger');
        }
      },
      error: async () => {
        await this.mostrarToast('No se puede eliminar este producto porque tiene ventas asociadas.', 'danger');
      }
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