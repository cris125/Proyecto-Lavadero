export interface Cliente {
  id?: string;
  nombre: string;
  telefono: string;
  email?: string;
  observaciones: string;
  createdAt?: number;
  updatedAt?: number;
}
