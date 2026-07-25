import { AppError } from './Excepciones';

export class ValidationError extends AppError {
  constructor(message: string = 'Datos inválidos') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
