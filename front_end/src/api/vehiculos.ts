import apiClient from './client';
import type { Vehiculo } from '@/types';

export async function obtenerVehiculosApi(): Promise<Vehiculo[]> {
  const { data } = await apiClient.get<Vehiculo[]>('/vehiculos');
  return data;
}

export async function obtenerVehiculoApi(id: string): Promise<Vehiculo> {
  const { data } = await apiClient.get<Vehiculo>(`/vehiculos/${id}`);
  return data;
}

export async function crearVehiculoApi(payload: Partial<Vehiculo>): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/vehiculos', payload);
  return data;
}

export async function editarVehiculoApi(id: string, payload: Partial<Vehiculo>): Promise<void> {
  await apiClient.put(`/vehiculos/${id}`, payload);
}

export async function eliminarVehiculoApi(id: string): Promise<void> {
  await apiClient.delete(`/vehiculos/${id}`);
}
