import { AppError } from './Excepciones';

export class AuthError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}
