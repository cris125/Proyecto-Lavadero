import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { Gasto } from '../models/Gasto';

export class GastoRepository extends BaseRepository<Gasto> {
  constructor(db: Database) {
    super(db, 'gastos');
  }

  async buscarPorFecha(desde: number, hasta: number): Promise<Gasto[]> {
    const todos = await this.obtener_registros();
    return todos.filter((g) => g.fecha >= desde && g.fecha <= hasta);
  }
}
