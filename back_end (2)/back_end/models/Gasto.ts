export interface Gasto {
  id?: string;
  concepto: string;
  monto: number;
  categoria: string;
  fecha: number;
  createdAt?: number;
  updatedAt?: number;
}
