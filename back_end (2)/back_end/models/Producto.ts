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
