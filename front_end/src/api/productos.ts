import apiClient from './client';
import type { Producto } from '@/types';

export async function obtenerProductosApi(): Promise<Producto[]> {
  const { data } = await apiClient.get<Producto[]>('/productos');
  return data;
}

export async function obtenerProductoApi(id: string): Promise<Producto> {
  const { data } = await apiClient.get<Producto>(`/productos/${id}`);
  return data;
}

export async function crearProductoApi(payload: Partial<Producto>): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>('/productos', payload);
  return data;
}

export async function editarProductoApi(id: string, payload: Partial<Producto>): Promise<void> {
  await apiClient.put(`/productos/${id}`, payload);
}

export async function eliminarProductoApi(id: string): Promise<void> {
  await apiClient.delete(`/productos/${id}`);
}
