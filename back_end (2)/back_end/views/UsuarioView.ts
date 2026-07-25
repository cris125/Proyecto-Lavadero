import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuario/UsuarioService';

export class UsuarioView {
  constructor(private usuarioService: UsuarioService) {}

  crearUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, apellido, email, telefono, contraseña, rol } = req.body;
      const rolSolicitante = req.usuario?.rol || 'ADMIN';
      const result = await this.usuarioService.crearUsuario(rolSolicitante, {
        nombre, apellido, email, telefono, contraseña,
        rol: rol || 'COLABORADOR',
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  registrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, apellido, email, telefono, contraseña } = req.body;
      const result = await this.usuarioService.registrarUsuario({ nombre, apellido, email, telefono, contraseña });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, contraseña } = req.body;
      const result = await this.usuarioService.login(email, contraseña);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  obtenerUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const usuario = await this.usuarioService.obtenerUsuario(id);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  };

  obtenerUsuarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarios = await this.usuarioService.obtenerUsuarios();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  };

  editarUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.usuarioService.editarUsuario(id, req.body);
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  eliminarUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.usuarioService.eliminarUsuario(id);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  actualizarPerfil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarioId = req.usuario!.usuarioId;
      const { nombre, apellido, telefono } = req.body;
      await this.usuarioService.actualizarPerfil(usuarioId, { nombre, apellido, telefono });
      res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
      next(error);
    }
  };

  cambiarPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarioId = req.usuario!.usuarioId;
      const { contraseñaActual, nuevaContraseña } = req.body;
      await this.usuarioService.cambiarPassword(usuarioId, contraseñaActual, nuevaContraseña);
      res.json({ message: 'Contraseña cambiada correctamente' });
    } catch (error) {
      next(error);
    }
  };

  restablecerPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { contraseña } = req.body;
      await this.usuarioService.restablecerPassword(id, contraseña);
      res.json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
