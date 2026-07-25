import { GastoRepository } from '../../repository/gasto_repository';
import { Gasto } from '../../models/Gasto';
import { validarEntrada } from '../../utils/validators';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { ValidationError } from '../../excepciones/ValidationError';

export class GastoService {
  constructor(private gastoRepo: GastoRepository) {}

  async crearGasto(data: { concepto: string; monto: number; categoria: string; fecha: number }): Promise<{ id: string }> {
    if (!data.concepto) {
      throw new ValidationError('El concepto del gasto es obligatorio');
    }
    if (data.monto <= 0) {
      throw new ValidationError('El monto debe ser mayor a cero');
    }
    if (!validarEntrada(data.concepto)) {
      throw new ValidationError('El concepto contiene caracteres no permitidos');
    }

    const now = Date.now();
    const id = `gas_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const gasto: Gasto = {
      id,
      concepto: data.concepto,
      monto: data.monto,
      categoria: data.categoria,
      fecha: data.fecha || now,
      createdAt: now,
      updatedAt: now,
    };

    await this.gastoRepo.agregar_registro(id, gasto);
    return { id };
  }

  async obtenerGasto(id: string): Promise<Gasto> {
    const gasto = await this.gastoRepo.obtener_registro(id);
    if (!gasto) {
      throw new NotFoundError('Gasto no encontrado');
    }
    return gasto;
  }

  async obtenerGastos(): Promise<Gasto[]> {
    return this.gastoRepo.obtener_registros();
  }

  async obtenerGastosPorFecha(desde: number, hasta: number): Promise<Gasto[]> {
    return this.gastoRepo.buscarPorFecha(desde, hasta);
  }

  async editarGasto(id: string, data: Partial<Gasto>): Promise<void> {
    const existente = await this.gastoRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Gasto no encontrado');
    }
    data.updatedAt = Date.now();
    await this.gastoRepo.modificar_registro(id, data);
  }

  async eliminarGasto(id: string): Promise<void> {
    const existente = await this.gastoRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Gasto no encontrado');
    }
    await this.gastoRepo.eliminar_registro(id);
  }
}
