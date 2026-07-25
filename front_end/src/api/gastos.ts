import apiClient from './client';
import type { Gasto } from '@/types';

export async function obtenerGastosApi(params?: { desde?: number; hasta?: number }): Promise<Gasto[]> {
  const { data } = await apiClient.get<Gasto[]>('/gastos', { params });
  return data;
}

export async function obtenerGastoApi(id: string): Promise<Gasto> {
  const { data } = await apiClient.get<Gasto>(`/gastos/${id}`);
  return data;
}

export async function crearGastoApi(payload: Partial<Gasto>): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/gastos', payload);
  return data;
}

export async function editarGastoApi(id: string, payload: Partial<Gasto>): Promise<void> {
  await apiClient.put(`/gastos/${id}`, payload);
}

export async function eliminarGastoApi(id: string): Promise<void> {
  await apiClient.delete(`/gastos/${id}`);
}
