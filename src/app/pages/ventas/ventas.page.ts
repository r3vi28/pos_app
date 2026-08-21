import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Cliente } from '../../interfaces/cliente';
import { Producto } from '../../interfaces/producto';
import {
  DetalleLinea,
  Venta,
  VentaCreateRequest,
} from '../../interfaces/venta';
import { AuthService } from '../../services/auth';
import { ClientesService } from '../../services/clientes';
import { ProductosService } from '../../services/productos';
import { VentasService } from '../../services/ventas';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonModal,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ],
})
export class VentasPage implements OnInit {
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  showCrearModal = false;
  clienteSeleccionado: number | null = null;
  descuento = 0;
  lineas: DetalleLinea[] = [{ productoId: null, cantidad: 1 }];
  totalCalculado = 0;

  showDetalleModal = false;
  ventaSeleccionada: Venta | null = null;

  constructor(
    private ventasService: VentasService,
    private clientesService: ClientesService,
    private productosService: ProductosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadVentas();
    this.loadClientes();
    this.loadProductos();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadVentas(): void {
    this.ventasService.getVentas(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.ventas = response.datos;
        this.totalPages = response.maxPages;
      },
      error: () => alert('Error al cargar las ventas.'),
    });
  }

  loadClientes(): void {
    this.clientesService.getClientes(1, 1000).subscribe({
      next: (response) => (this.clientes = response.datos),
      error: () => alert('Error al cargar los clientes.'),
    });
  }

  loadProductos(): void {
    this.productosService.getProductos(1, 1000).subscribe({
      next: (response) => {
        this.productos = response.datos;
      },
      error: () => alert('Error al cargar los productos.'),
    });
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadVentas();
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadVentas();
    }
  }

  agregarLinea(): void {
    this.lineas.push({ productoId: null, cantidad: 1 });
  }

  quitarLinea(index: number): void {
    if (this.lineas.length > 1) {
      this.lineas.splice(index, 1);
      this.calcularTotal();
    }
  }

  calcularTotal(): void {
    const subtotal = this.lineas.reduce((total, linea) => {
      const producto = this.productos.find(
        (item) => item.id === Number(linea.productoId)
      );
      return total + (producto ? Number(producto.precio) * Number(linea.cantidad) : 0);
    }, 0);

    this.totalCalculado = subtotal - Number(this.descuento);
  }

  confirmarVenta(): void {
    if (
      this.clienteSeleccionado === null ||
      this.lineas.some(
        (linea) => linea.productoId === null || Number(linea.cantidad) <= 0
      )
    ) {
      alert('Seleccione un cliente y complete los productos con cantidades mayores a cero.');
      return;
    }

    const data: VentaCreateRequest = {
      cliente: this.clienteSeleccionado,
      descuento: Number(this.descuento),
      detalles: this.lineas.map((linea) => ({
        producto: linea.productoId as number,
        cantidad: Number(linea.cantidad),
      })),
    };

    this.ventasService.createVenta(data).subscribe({
      next: () => {
        this.cerrarCrearModal();
        this.loadVentas();
      },
      error: () => alert('Error al crear la venta.'),
    });
  }

  verDetalle(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.showDetalleModal = true;
  }

  eliminarVenta(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta venta?')) {
      return;
    }

    this.ventasService.deleteVenta(id).subscribe({
      next: () => this.loadVentas(),
      error: () => alert('Error al eliminar la venta.'),
    });
  }

  abrirCrearModal(): void {
    this.clienteSeleccionado = null;
    this.descuento = 0;
    this.lineas = [{ productoId: null, cantidad: 1 }];
    this.totalCalculado = 0;
    this.showCrearModal = true;
  }

  cerrarCrearModal(): void {
    this.showCrearModal = false;
    this.clienteSeleccionado = null;
    this.descuento = 0;
    this.lineas = [{ productoId: null, cantidad: 1 }];
    this.totalCalculado = 0;
  }

  cerrarDetalleModal(): void {
    this.showDetalleModal = false;
    this.ventaSeleccionada = null;
  }

  nombreCliente(clienteId: number): string {
    const cliente = this.clientes.find((item) => item.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido ?? ''}`.trim() : String(clienteId);
  }

  nombreProducto(productoId: number): string {
    return this.productos.find((item) => item.id === productoId)?.nombre ?? String(productoId);
  }
}
