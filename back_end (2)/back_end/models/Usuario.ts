export interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contraseña: string;
  rol: 'ADMIN' | 'COLABORADOR';
  estado: 'activo' | 'inactivo';
  createdAt?: number;
  updatedAt?: number;
}
