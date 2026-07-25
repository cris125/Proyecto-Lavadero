import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../excepciones/ForbiddenError';

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.usuario || req.usuario.rol !== 'ADMIN') {
    throw new ForbiddenError('Acción permitida solo para administradores');
  }
  next();
}

export function requireColaborador(req: Request, _res: Response, next: NextFunction): void {
  if (!req.usuario || req.usuario.rol !== 'COLABORADOR') {
    throw new ForbiddenError('Acción permitida solo para colaboradores');
  }
  next();
}

export function requireRol(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      throw new ForbiddenError('No tienes permisos para realizar esta acción');
    }
    next();
  };
}
