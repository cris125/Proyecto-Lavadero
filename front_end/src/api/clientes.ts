import apiClient from './client';
import type { Cliente } from '@/types';

export async function obtenerClientesApi(): Promise<Cliente[]> {
  const { data } = await apiClient.get<Cliente[]>('/clientes');
  return data;
}

export async function obtenerClienteApi(id: string): Promise<Cliente> {
  const { data } = await apiClient.get<Cliente>(`/clientes/${id}`);
  return data;
}

export async function crearClienteApi(payload: Partial<Cliente>): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/clientes', payload);
  return data;
}

export async function editarClienteApi(id: string, payload: Partial<Cliente>): Promise<void> {
  await apiClient.put(`/clientes/${id}`, payload);
}

export async function eliminarClienteApi(id: string): Promise<void> {
  await apiClient.delete(`/clientes/${id}`);
}

export async function buscarClientePorTelefonoApi(telefono: string): Promise<Cliente | null> {
  const { data } = await apiClient.get<Cliente | null>(`/clientes/buscar?telefono=${telefono}`);
  return data;
}
