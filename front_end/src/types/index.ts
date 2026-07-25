export interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'ADMIN' | 'COLABORADOR';
  estado: 'activo' | 'inactivo';
  createdAt?: number;
  updatedAt?: number;
}

export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  cantidad: number;
  unidad: string;
  estado: 'disponible' | 'agotado' | 'descontinuado';
  createdAt?: number;
  updatedAt?: number;
}

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

export interface Cliente {
  id?: string;
  nombre: string;
  telefono: string;
  email?: string;
  observaciones: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Vehiculo {
  id?: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipo: string;
  propietario_id: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface RegistroLavado {
  id?: string;
  placa?: string;
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

export interface Gasto {
  id?: string;
  concepto: string;
  monto: number;
  categoria: string;
  fecha: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface DashboardHoy {
  vehiculos_lavados: number;
  ingresos: number;
  servicios_mas_vendidos: { servicio_id: string; cantidad: number }[];
  colaborador_mas_lavados: { colaborador_id: string; cantidad: number };
}

export interface DashboardSemana {
  ingresos: number;
  vehiculos_atendidos: number;
}

export interface DashboardMes {
  ingresos: number;
  gastos: number;
  utilidad: number;
  clientes_nuevos: number;
}

export interface LoginResponse {
  usuario: Omit<Usuario, 'contraseña'>;
  token: string;
}

export interface VentaPorPeriodo {
  fecha: string;
  cantidad: number;
  total: number;
}

export interface ServicioMasVendido {
  servicio_id: string;
  cantidad: number;
  total: number;
}

export interface ColaboradorProductividad {
  colaborador_id: string;
  cantidad: number;
  total: number;
}

export interface ClienteFrecuente {
  cliente_id: string;
  cantidad: number;
  total_gastado: number;
}

export interface Utilidad {
  ingresos: number;
  gastos: number;
  utilidad: number;
}
