import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { Usuario } from '../models/Usuario';

export class UsuarioRepository extends BaseRepository<Usuario> {
  constructor(db: Database) {
    super(db, 'usuarios');
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuarios = await this.obtener_registros();
    return usuarios.find((u) => u.email === email) || null;
  }
}
