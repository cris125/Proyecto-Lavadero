import { Request, Response, NextFunction } from 'express';
import { AppError } from '../excepciones/Excepciones';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  console.error('Error no manejado:', err);
  res.status(500).json({
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    },
  });
}
