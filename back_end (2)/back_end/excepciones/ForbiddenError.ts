import { AppError } from './Excepciones';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acción no permitida') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}
