import apiClient from './client';
import type { DashboardHoy, DashboardSemana, DashboardMes } from '@/types';

export async function obtenerDashboardHoyApi(): Promise<DashboardHoy> {
  const { data } = await apiClient.get<DashboardHoy>('/dashboard/hoy');
  return data;
}

export async function obtenerDashboardSemanaApi(): Promise<DashboardSemana> {
  const { data } = await apiClient.get<DashboardSemana>('/dashboard/semana');
  return data;
}

export async function obtenerDashboardMesApi(): Promise<DashboardMes> {
  const { data } = await apiClient.get<DashboardMes>('/dashboard/mes');
  return data;
}
