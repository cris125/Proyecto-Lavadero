import { RegistroLavadoRepository } from '../../repository/registro_lavado_repository';
import { RegistroLavado } from '../../models/RegistroLavado';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { ValidationError } from '../../excepciones/ValidationError';

export class RegistroLavadoService {
  constructor(private registroRepo: RegistroLavadoRepository) {}

  async crearRegistro(data: {
    cliente_id: string;
    vehiculo_id: string;
    colaborador_id: string;
    servicio_id: string;
    precio: number;
    observaciones: string;
  }): Promise<{ id: string }> {
    if (!data.cliente_id || !data.vehiculo_id || !data.colaborador_id || !data.servicio_id) {
      throw new ValidationError('Todos los campos obligatorios deben estar llenos');
    }
    if (data.precio < 0) {
      throw new ValidationError('El precio no puede ser negativo');
    }

    const now = Date.now();
    const date = new Date(now);
    const hora = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const id = `lav_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const registro: RegistroLavado = {
      id,
      cliente_id: data.cliente_id,
      vehiculo_id: data.vehiculo_id,
      colaborador_id: data.colaborador_id,
      servicio_id: data.servicio_id,
      precio: data.precio,
      fecha: now,
      hora,
      observaciones: data.observaciones || '',
      estado: 'completado',
      createdAt: now,
      updatedAt: now,
    };

    await this.registroRepo.agregar_registro(id, registro);
    return { id };
  }

  async obtenerRegistro(id: string): Promise<RegistroLavado> {
    const registro = await this.registroRepo.obtener_registro(id);
    if (!registro) {
      throw new NotFoundError('Registro no encontrado');
    }
    return registro;
  }

  async obtenerRegistros(): Promise<RegistroLavado[]> {
    return this.registroRepo.obtener_registros();
  }

  async obtenerRegistrosPorColaborador(colaboradorId: string): Promise<RegistroLavado[]> {
    return this.registroRepo.buscarPorColaborador(colaboradorId);
  }

  async obtenerRegistrosPorCliente(clienteId: string): Promise<RegistroLavado[]> {
    return this.registroRepo.buscarPorCliente(clienteId);
  }

  async obtenerRegistrosPorFecha(desde: number, hasta: number): Promise<RegistroLavado[]> {
    return this.registroRepo.buscarPorFecha(desde, hasta);
  }

  async editarRegistro(id: string, data: Partial<RegistroLavado>): Promise<void> {
    const existente = await this.registroRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Registro no encontrado');
    }
    data.updatedAt = Date.now();
    await this.registroRepo.modificar_registro(id, data);
  }

  async eliminarRegistro(id: string): Promise<void> {
    const existente = await this.registroRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Registro no encontrado');
    }
    await this.registroRepo.eliminar_registro(id);
  }
}
