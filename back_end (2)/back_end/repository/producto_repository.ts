import { Database } from 'firebase/database';
import { BaseRepository } from './base_repository';
import { Producto } from '../models/Producto';

export class ProductoRepository extends BaseRepository<Producto> {
  constructor(db: Database) {
    super(db, 'productos');
  }
}
