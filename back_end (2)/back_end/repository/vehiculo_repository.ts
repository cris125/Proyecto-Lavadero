import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { Vehiculo } from '../models/Vehiculo';

export class VehiculoRepository extends BaseRepository<Vehiculo> {
  constructor(db: Database) {
    super(db, 'vehiculos');
  }

  async buscarPorPropietario(propietarioId: string): Promise<Vehiculo[]> {
    const todos = await this.obtener_registros();
    return todos.filter((v) => v.propietario_id === propietarioId);
  }

  async buscarPorPlaca(placa: string): Promise<Vehiculo | null> {
    const todos = await this.obtener_registros();
    return todos.find((v) => v.placa.toUpperCase() === placa.toUpperCase()) || null;
  }
}
