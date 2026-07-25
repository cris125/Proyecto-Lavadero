import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lavadero-secret-key-dev';
const JWT_EXPIRES_IN = '24h';

export interface TokenPayload {
  usuarioId: string;
  email: string;
  rol: string;
}

export function generarToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verificarToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
