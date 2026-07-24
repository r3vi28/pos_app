export interface Cliente {
    id: number;
    nombre: string;
    apellido: string | null;
    have_rnc: boolean;
    rnc: string | null;
    email: string;
    telefono: string | null;
    direccion: string | null;
}