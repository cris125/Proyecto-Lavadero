import apiClient from './client';
import type { Servicio } from '@/types';

export async function obtenerServiciosApi(): Promise<Servicio[]> {
  const { data } = await apiClient.get<Servicio[]>('/servicios');
  return data;
}

export async function obtenerServiciosActivosApi(): Promise<Servicio[]> {
  const { data } = await apiClient.get<Servicio[]>('/servicios/activos');
  return data;
}

export async function obtenerServicioApi(id: string): Promise<Servicio> {
  const { data } = await apiClient.get<Servicio>(`/servicios/${id}`);
  return data;
}

export async function crearServicioApi(payload: Partial<Servicio>): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/servicios', payload);
  return data;
}

export async function editarServicioApi(id: string, payload: Partial<Servicio>): Promise<void> {
  await apiClient.put(`/servicios/${id}`, payload);
}

export async function eliminarServicioApi(id: string): Promise<void> {
  await apiClient.delete(`/servicios/${id}`);
}
