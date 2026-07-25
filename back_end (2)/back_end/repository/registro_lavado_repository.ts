import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { RegistroLavado } from '../models/RegistroLavado';

export class RegistroLavadoRepository extends BaseRepository<RegistroLavado> {
  constructor(db: Database) {
    super(db, 'registros_lavado');
  }

  async buscarPorColaborador(colaboradorId: string): Promise<RegistroLavado[]> {
    const todos = await this.obtener_registros();
    return todos.filter((r) => r.colaborador_id === colaboradorId);
  }

  async buscarPorCliente(clienteId: string): Promise<RegistroLavado[]> {
    const todos = await this.obtener_registros();
    return todos.filter((r) => r.cliente_id === clienteId);
  }

  async buscarPorFecha(desde: number, hasta: number): Promise<RegistroLavado[]> {
    const todos = await this.obtener_registros();
    return todos.filter((r) => r.fecha >= desde && r.fecha <= hasta);
  }
}
