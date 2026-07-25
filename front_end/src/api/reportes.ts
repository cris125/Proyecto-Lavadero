import apiClient from './client';
import type { VentaPorPeriodo, ServicioMasVendido, ColaboradorProductividad, ClienteFrecuente, Utilidad } from '@/types';

export async function ventasApi(desde: number, hasta: number, agrupacion?: string): Promise<VentaPorPeriodo[]> {
  const { data } = await apiClient.get<VentaPorPeriodo[]>('/reportes/ventas', { params: { desde, hasta, agrupacion } });
  return data;
}

export async function serviciosMasVendidosApi(desde: number, hasta: number): Promise<ServicioMasVendido[]> {
  const { data } = await apiClient.get<ServicioMasVendido[]>('/reportes/servicios-mas-vendidos', { params: { desde, hasta } });
  return data;
}

export async function colaboradoresProductividadApi(desde: number, hasta: number): Promise<ColaboradorProductividad[]> {
  const { data } = await apiClient.get<ColaboradorProductividad[]>('/reportes/colaboradores', { params: { desde, hasta } });
  return data;
}

export async function clientesFrecuentesApi(desde: number, hasta: number): Promise<ClienteFrecuente[]> {
  const { data } = await apiClient.get<ClienteFrecuente[]>('/reportes/clientes-frecuentes', { params: { desde, hasta } });
  return data;
}

export async function utilidadApi(desde: number, hasta: number): Promise<Utilidad> {
  const { data } = await apiClient.get<Utilidad>('/reportes/utilidad', { params: { desde, hasta } });
  return data;
}
