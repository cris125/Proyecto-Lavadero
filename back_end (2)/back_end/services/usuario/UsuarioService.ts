import { UsuarioRepository } from '../../repository/usuario_repository';
import { Usuario } from '../../models/Usuario';
import { hashPassword, comparePassword } from '../../utils/hash';
import { validarEntrada, validarContrasena, validarTelefono, validarEmail } from '../../utils/validators';
import { generarToken } from '../../utils/jwt';
import { NotFoundError } from '../../excepciones/NotFoundError';
import { AuthError } from '../../excepciones/AuthError';
import { ValidationError } from '../../excepciones/ValidationError';

export class UsuarioService {
  constructor(private usuarioRepo: UsuarioRepository) {}

  async crearUsuario(
    rolSolicitante: string,
    data: { nombre: string; apellido: string; email: string; telefono: string; contraseña: string; rol: 'ADMIN' | 'COLABORADOR' }
  ): Promise<{ id: string }> {
    if (data.rol === 'ADMIN' && rolSolicitante !== 'ADMIN') {
      throw new AuthError('No tienes permisos para crear administradores');
    }

    if (!validarTelefono(data.telefono)) {
      throw new ValidationError('El teléfono debe tener 10 dígitos');
    }
    if (!validarEmail(data.email)) {
      throw new ValidationError('El email no es válido');
    }
    if (!validarContrasena(data.contraseña)) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y carácter especial');
    }

    const campos = [data.nombre, data.apellido, data.email, data.telefono];
    for (const campo of campos) {
      if (!validarEntrada(campo)) {
        throw new ValidationError('Algún campo contiene caracteres no permitidos');
      }
    }

    const existente = await this.usuarioRepo.buscarPorEmail(data.email);
    if (existente) {
      throw new ValidationError('El email ya está registrado');
    }

    const hashedPassword = await hashPassword(data.contraseña);
    const now = Date.now();
    const id = `usr_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const usuario: Usuario = {
      id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      contraseña: hashedPassword,
      rol: data.rol,
      estado: 'activo',
      createdAt: now,
      updatedAt: now,
    };

    await this.usuarioRepo.agregar_registro(id, usuario);
    return { id };
  }

  async registrarUsuario(
    data: { nombre: string; apellido: string; email: string; telefono: string; contraseña: string }
  ): Promise<{ usuario: Omit<Usuario, 'contraseña'>; token: string }> {
    const cuenta = await this.usuarioRepo.buscarPorEmail(data.email);
    if (cuenta) {
      throw new ValidationError('El email ya está registrado');
    }
    if (!validarTelefono(data.telefono)) {
      throw new ValidationError('El teléfono debe tener 10 dígitos');
    }
    if (!validarEmail(data.email)) {
      throw new ValidationError('El email no es válido');
    }
    if (!validarContrasena(data.contraseña)) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y carácter especial');
    }
    for (const campo of [data.nombre, data.apellido, data.email, data.telefono]) {
      if (!validarEntrada(campo)) {
        throw new ValidationError('Algún campo contiene caracteres no permitidos');
      }
    }
    const hashedPassword = await hashPassword(data.contraseña);
    const now = Date.now();
    const id = `usr_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const usuario: Usuario = {
      id, nombre: data.nombre, apellido: data.apellido, email: data.email,
      telefono: data.telefono, contraseña: hashedPassword, rol: 'COLABORADOR',
      estado: 'activo', createdAt: now, updatedAt: now,
    };
    await this.usuarioRepo.agregar_registro(id, usuario);
    const token = generarToken({ usuarioId: id, email: usuario.email, rol: usuario.rol });
    const { contraseña: _, ...usuarioSinPassword } = usuario;
    return { usuario: usuarioSinPassword, token };
  }

  async login(email: string, contraseña: string): Promise<{ usuario: Omit<Usuario, 'contraseña'>; token: string }> {
    if (!validarEntrada(email)) {
      throw new ValidationError('Email inválido');
    }

    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario || !usuario.id) {
      throw new AuthError('Usuario o contraseña incorrectos');
    }
    if (usuario.estado === 'inactivo') {
      throw new AuthError('Cuenta desactivada. Contacta al administrador');
    }

    const coincide = await comparePassword(contraseña, usuario.contraseña);
    if (!coincide) {
      throw new AuthError('Usuario o contraseña incorrectos');
    }

    const token = generarToken({
      usuarioId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    const { contraseña: _, ...usuarioSinPassword } = usuario;
    return { usuario: usuarioSinPassword, token };
  }

  async obtenerUsuario(id: string): Promise<Omit<Usuario, 'contraseña'>> {
    const usuario = await this.usuarioRepo.obtener_registro(id);
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }
    const { contraseña: _, ...rest } = usuario;
    return rest;
  }

  async obtenerUsuarios(): Promise<Omit<Usuario, 'contraseña'>[]> {
    const usuarios = await this.usuarioRepo.obtener_registros();
    return usuarios.map(({ contraseña: _, ...rest }) => rest);
  }

  async editarUsuario(id: string, data: Partial<Usuario>): Promise<void> {
    const existente = await this.usuarioRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Usuario no encontrado');
    }
    if (data.contraseña) {
      data.contraseña = await hashPassword(data.contraseña);
    }
    data.updatedAt = Date.now();
    await this.usuarioRepo.modificar_registro(id, data);
  }

  async eliminarUsuario(id: string): Promise<void> {
    const existente = await this.usuarioRepo.obtener_registro(id);
    if (!existente) {
      throw new NotFoundError('Usuario no encontrado');
    }
    await this.usuarioRepo.eliminar_registro(id);
  }

  async actualizarPerfil(
    usuarioId: string, data: { nombre?: string; apellido?: string; telefono?: string }
  ): Promise<void> {
    const existente = await this.usuarioRepo.obtener_registro(usuarioId);
    if (!existente) throw new NotFoundError('Usuario no encontrado');
    const campos = [data.nombre, data.apellido, data.telefono].filter(Boolean);
    for (const campo of campos) {
      if (!validarEntrada(campo!)) throw new ValidationError('Caracteres no permitidos');
    }
    await this.usuarioRepo.modificar_registro(usuarioId, { ...data, updatedAt: Date.now() });
  }

  async cambiarPassword(usuarioId: string, contraseñaActual: string, nuevaContraseña: string): Promise<void> {
    const existente = await this.usuarioRepo.obtener_registro(usuarioId);
    if (!existente) throw new NotFoundError('Usuario no encontrado');
    const coincide = await comparePassword(contraseñaActual, existente.contraseña);
    if (!coincide) throw new AuthError('La contraseña actual es incorrecta');
    if (!validarContrasena(nuevaContraseña)) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y carácter especial');
    }
    const hashed = await hashPassword(nuevaContraseña);
    await this.usuarioRepo.modificar_registro(usuarioId, { contraseña: hashed, updatedAt: Date.now() });
  }

  async restablecerPassword(id: string, nuevaContraseña: string): Promise<void> {
    if (!validarContrasena(nuevaContraseña)) {
      throw new ValidationError('La contraseña no cumple los requisitos de seguridad');
    }
    const hashed = await hashPassword(nuevaContraseña);
    await this.usuarioRepo.modificar_registro(id, { contraseña: hashed, updatedAt: Date.now() });
  }
}
