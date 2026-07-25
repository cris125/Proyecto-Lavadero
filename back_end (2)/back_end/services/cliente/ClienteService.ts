import { ClienteRepository } from '../../repository/cliente_repository';
import { Cliente } from '../../models/Cliente';
import { validarEntrada, validarTelefono, validarEmail } from '../../utils/validators';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { ValidationError } from '../../excepciones/ValidationError';

export class ClienteService {
  constructor(private clienteRepo: ClienteRepository) {}

  async crearCliente(data: { nombre: string; telefono: string; email?: string; observaciones: string }): Promise<{ id: string }> {
    if (!data.nombre) {
      throw new ValidationError('El nombre del cliente es obligatorio');
    }
    if (!validarTelefono(data.telefono)) {
      throw new ValidationError('El teléfono debe tener 10 dígitos');
    }
    if (data.email && !validarEmail(data.email)) {
      throw new ValidationError('El email no es válido');
    }
    if (!validarEntrada(data.nombre)) {
      throw new ValidationError('El nombre contiene caracteres no permitidos');
    }

    const now = Date.now();
    const id = `cli_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const cliente: Cliente = {
      id,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email || '',
      observaciones: data.observaciones || '',
      createdAt: now,
      updatedAt: now,
    };

    await this.clienteRepo.agregar_registro(id, cliente);
    return { id };
  }

  async obtenerCliente(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepo.obtener_registro(id);
    if (!cliente) {
      throw new NotFoundError('Cliente no encontrado');
    }
    return cliente;
  }

  async obtenerClientes(): Promise<Cliente[]> {
    return this.clienteRepo.obtener_registros();
  }

  async buscarPorTelefono(telefono: string): Promise<Cliente | null> {
    const clientes = await this.clienteRepo.obtener_registros();
    return clientes.find((c) => c.telefono === telefono) || null;
  }

  async editarCliente(id: string, data: Partial<Cliente>): Promise<void> {
    const existente = await this.clienteRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Cliente no encontrado');
    }
    data.updatedAt = Date.now();
    await this.clienteRepo.modificar_registro(id, data);
  }

  async eliminarCliente(id: string): Promise<void> {
    const existente = await this.clienteRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Cliente no encontrado');
    }
    await this.clienteRepo.eliminar_registro(id);
  }
}
