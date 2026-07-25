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
