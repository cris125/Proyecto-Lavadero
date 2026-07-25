import apiClient from './client';
import type { LoginResponse } from '@/types';

export async function loginApi(email: string, contraseña: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/usuarios/login', { email, contraseña });
  return data;
}

export async function registerApi(data: { nombre: string; apellido: string; email: string; telefono: string; contraseña: string }): Promise<LoginResponse> {
  const { data: res } = await apiClient.post<LoginResponse>('/usuarios/register', data);
  return res;
}
