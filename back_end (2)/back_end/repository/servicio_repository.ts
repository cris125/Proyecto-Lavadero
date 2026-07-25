import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { Servicio } from '../models/Servicio';

export class ServicioRepository extends BaseRepository<Servicio> {
  constructor(db: Database) {
    super(db, 'servicios');
  }
}
