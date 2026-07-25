import { ServicioRepository } from '../../repository/servicio_repository';
import { Servicio } from '../../models/Servicio';
import { validarEntrada } from '../../utils/validators';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { ValidationError } from '../../excepciones/ValidationError';

export class ServicioService {
  constructor(private servicioRepo: ServicioRepository) {}

  async crearServicio(data: { nombre: string; descripcion: string; precio: number; duracion: number }): Promise<{ id: string }> {
    if (!data.nombre) {
      throw new ValidationError('El nombre del servicio es obligatorio');
    }
    if (data.precio < 0) {
      throw new ValidationError('El precio no puede ser negativo');
    }
    if (data.duracion <= 0) {
      throw new ValidationError('La duración debe ser mayor a cero');
    }
    if (!validarEntrada(data.nombre)) {
      throw new ValidationError('El nombre contiene caracteres no permitidos');
    }

    const now = Date.now();
    const id = `svc_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const servicio: Servicio = {
      id,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      precio: data.precio,
      duracion: data.duracion,
      estado: 'activo',
      createdAt: now,
      updatedAt: now,
    };

    await this.servicioRepo.agregar_registro(id, servicio);
    return { id };
  }

  async obtenerServicio(id: string): Promise<Servicio> {
    const servicio = await this.servicioRepo.obtener_registro(id);
    if (!servicio) {
      throw new NotFoundError('Servicio no encontrado');
    }
    return servicio;
  }

  async obtenerServicios(): Promise<Servicio[]> {
    return this.servicioRepo.obtener_registros();
  }

  async obtenerServiciosActivos(): Promise<Servicio[]> {
    const todos = await this.servicioRepo.obtener_registros();
    return todos.filter((s) => s.estado === 'activo');
  }

  async editarServicio(id: string, data: Partial<Servicio>): Promise<void> {
    const existente = await this.servicioRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Servicio no encontrado');
    }
    if (data.precio != null && data.precio < 0) {
      throw new ValidationError('El precio no puede ser negativo');
    }
    data.updatedAt = Date.now();
    await this.servicioRepo.modificar_registro(id, data);
  }

  async eliminarServicio(id: string): Promise<void> {
    const existente = await this.servicioRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Servicio no encontrado');
    }
    await this.servicioRepo.eliminar_registro(id);
  }
}
