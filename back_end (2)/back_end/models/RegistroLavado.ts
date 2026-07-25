export interface RegistroLavado {
  id?: string;
  cliente_id: string;
  vehiculo_id: string;
  colaborador_id: string;
  servicio_id: string;
  precio: number;
  fecha: number;
  hora: string;
  observaciones: string;
  estado: 'completado' | 'cancelado';
  createdAt?: number;
  updatedAt?: number;
}
