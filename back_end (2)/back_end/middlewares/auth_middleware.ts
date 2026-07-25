import { Request, Response, NextFunction } from 'express';
import { verificarToken, TokenPayload } from '../utils/jwt';
import { AuthError } from '../excepciones/AuthError';

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AuthError('Token de autenticación requerido');
  }

  const token = header.split(' ')[1];

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch {
    throw new AuthError('Token inválido o expirado');
  }
}
