export interface Servicio {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  estado: 'activo' | 'inactivo';
  createdAt?: number;
  updatedAt?: number;
}
