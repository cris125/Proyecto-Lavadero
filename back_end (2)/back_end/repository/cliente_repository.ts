import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { Cliente } from '../models/Cliente';

export class ClienteRepository extends BaseRepository<Cliente> {
  constructor(db: Database) {
    super(db, 'clientes');
  }
}
