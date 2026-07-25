import apiClient from './client';
import type { RegistroLavado } from '@/types';

export async function obtenerRegistrosApi(params?: { desde?: number; hasta?: number; colaborador_id?: string; cliente_id?: string }): Promise<RegistroLavado[]> {
  const { data } = await apiClient.get<RegistroLavado[]>('/lavados', { params });
  return data;
}

export async function obtenerRegistroApi(id: string): Promise<RegistroLavado> {
  const { data } = await apiClient.get<RegistroLavado>(`/lavados/${id}`);
  return data;
}

export async function crearRegistroApi(payload: Partial<RegistroLavado>): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/lavados', payload);
  return data;
}

export async function editarRegistroApi(id: string, payload: Partial<RegistroLavado>): Promise<void> {
  await apiClient.put(`/lavados/${id}`, payload);
}

export async function eliminarRegistroApi(id: string): Promise<void> {
  await apiClient.delete(`/lavados/${id}`);
}
