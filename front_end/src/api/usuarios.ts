import apiClient from './client';
import type { Usuario } from '@/types';

export async function obtenerUsuariosApi(): Promise<Usuario[]> {
  const { data } = await apiClient.get<Usuario[]>('/usuarios');
  return data;
}

export async function obtenerUsuarioApi(id: string): Promise<Usuario> {
  const { data } = await apiClient.get<Usuario>(`/usuarios/${id}`);
  return data;
}

export async function crearUsuarioApi(payload: Partial<Usuario> & { contraseña: string }): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/usuarios', payload);
  return data;
}

export async function editarUsuarioApi(id: string, payload: Partial<Usuario>): Promise<void> {
  await apiClient.put(`/usuarios/${id}`, payload);
}

export async function eliminarUsuarioApi(id: string): Promise<void> {
  await apiClient.delete(`/usuarios/${id}`);
}

export async function restablecerPasswordApi(id: string, contraseña: string): Promise<void> {
  await apiClient.patch(`/usuarios/${id}/restablecer-password`, { contraseña });
}

export async function actualizarPerfilApi(data: { nombre?: string; apellido?: string; telefono?: string }): Promise<void> {
  await apiClient.put('/usuarios/perfil', data);
}

export async function cambiarPasswordApi(data: { contraseñaActual: string; nuevaContraseña: string }): Promise<void> {
  await apiClient.put('/usuarios/cambiar-password', data);
}
