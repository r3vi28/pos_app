export interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: string;
    stock: number;
    have_code: boolean;
    codigo_barra: string | null;
}