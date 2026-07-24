export interface DetalleVenta {
    id: number;
    producto: number;
    cantidad: number;
    precio_unitario: string;
    subtotal: string;
    }

export interface Venta {
    id: number;
    cliente: number;
    atendido_por: number;
    fecha: string;
    descuento: string;
    total: string;
    detalles: DetalleVenta[];
}