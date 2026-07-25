import { VehiculoRepository } from '../../repository/vehiculo_repository';
import { Vehiculo } from '../../models/Vehiculo';
import { validarEntrada } from '../../utils/validators';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { ValidationError } from '../../excepciones/ValidationError';

export class VehiculoService {
  constructor(private vehiculoRepo: VehiculoRepository) {}

  async crearVehiculo(data: { placa: string; marca: string; modelo: string; color: string; tipo: string; propietario_id: string }): Promise<{ id: string }> {
    if (!data.placa) {
      throw new ValidationError('La placa es obligatoria');
    }
    if (!data.propietario_id) {
      throw new ValidationError('El propietario es obligatorio');
    }
    if (!validarEntrada(data.placa)) {
      throw new ValidationError('La placa contiene caracteres no permitidos');
    }

    const existente = await this.vehiculoRepo.buscarPorPlaca(data.placa);
    if (existente) {
      throw new ValidationError('La placa ya está registrada');
    }

    const now = Date.now();
    const id = `veh_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const vehiculo: Vehiculo = {
      id,
      placa: data.placa.toUpperCase(),
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      tipo: data.tipo,
      propietario_id: data.propietario_id,
      createdAt: now,
      updatedAt: now,
    };

    await this.vehiculoRepo.agregar_registro(id, vehiculo);
    return { id };
  }

  async obtenerVehiculo(id: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepo.obtener_registro(id);
    if (!vehiculo) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    return vehiculo;
  }

  async obtenerVehiculos(): Promise<Vehiculo[]> {
    return this.vehiculoRepo.obtener_registros();
  }

  async obtenerVehiculosPorPropietario(propietarioId: string): Promise<Vehiculo[]> {
    return this.vehiculoRepo.buscarPorPropietario(propietarioId);
  }

  async buscarPorPlaca(placa: string): Promise<Vehiculo | null> {
    return this.vehiculoRepo.buscarPorPlaca(placa);
  }

  async editarVehiculo(id: string, data: Partial<Vehiculo>): Promise<void> {
    const existente = await this.vehiculoRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    data.updatedAt = Date.now();
    await this.vehiculoRepo.modificar_registro(id, data);
  }

  async eliminarVehiculo(id: string): Promise<void> {
    const existente = await this.vehiculoRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    await this.vehiculoRepo.eliminar_registro(id);
  }
}
