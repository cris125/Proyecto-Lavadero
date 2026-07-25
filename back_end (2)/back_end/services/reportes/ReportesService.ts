import { RegistroLavadoRepository } from '../../repository/registro_lavado_repository';
import { GastoRepository } from '../../repository/gasto_repository';
import { RegistroLavado } from '../../models/RegistroLavado';

export interface VentaPorPeriodo {
  fecha: string;
  cantidad: number;
  total: number;
}

export interface ServicioMasVendido {
  servicio_id: string;
  cantidad: number;
  total: number;
}

export interface ColaboradorProductividad {
  colaborador_id: string;
  cantidad: number;
  total: number;
}

export interface ClienteFrecuente {
  cliente_id: string;
  cantidad: number;
  total_gastado: number;
}

export interface Utilidad {
  ingresos: number;
  gastos: number;
  utilidad: number;
}

export class ReportesService {
  constructor(
    private registroRepo: RegistroLavadoRepository,
    private gastoRepo: GastoRepository
  ) {}

  async ventasPorPeriodo(desde: number, hasta: number, agrupacion: 'dia' | 'semana' | 'mes' = 'dia'): Promise<VentaPorPeriodo[]> {
    const registros = await this.registroRepo.buscarPorFecha(desde, hasta);
    const grupos = new Map<string, { cantidad: number; total: number }>();

    for (const r of registros) {
      const date = new Date(r.fecha);
      let key: string;
      if (agrupacion === 'dia') {
        key = date.toISOString().split('T')[0];
      } else if (agrupacion === 'semana') {
        const inicioSemana = new Date(date);
        inicioSemana.setDate(date.getDate() - date.getDay());
        key = inicioSemana.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      const grupo = grupos.get(key) || { cantidad: 0, total: 0 };
      grupo.cantidad++;
      grupo.total += r.precio;
      grupos.set(key, grupo);
    }

    return Array.from(grupos.entries())
      .map(([fecha, data]) => ({ fecha, ...data }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  async serviciosMasVendidos(desde: number, hasta: number): Promise<ServicioMasVendido[]> {
    const registros = await this.registroRepo.buscarPorFecha(desde, hasta);
    const grupos = new Map<string, { cantidad: number; total: number }>();

    for (const r of registros) {
      const grupo = grupos.get(r.servicio_id) || { cantidad: 0, total: 0 };
      grupo.cantidad++;
      grupo.total += r.precio;
      grupos.set(r.servicio_id, grupo);
    }

    return Array.from(grupos.entries())
      .map(([servicio_id, data]) => ({ servicio_id, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async colaboradoresProductividad(desde: number, hasta: number): Promise<ColaboradorProductividad[]> {
    const registros = await this.registroRepo.buscarPorFecha(desde, hasta);
    const grupos = new Map<string, { cantidad: number; total: number }>();

    for (const r of registros) {
      const grupo = grupos.get(r.colaborador_id) || { cantidad: 0, total: 0 };
      grupo.cantidad++;
      grupo.total += r.precio;
      grupos.set(r.colaborador_id, grupo);
    }

    return Array.from(grupos.entries())
      .map(([colaborador_id, data]) => ({ colaborador_id, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async clientesFrecuentes(desde: number, hasta: number): Promise<ClienteFrecuente[]> {
    const registros = await this.registroRepo.buscarPorFecha(desde, hasta);
    const grupos = new Map<string, { cantidad: number; total_gastado: number }>();

    for (const r of registros) {
      const grupo = grupos.get(r.cliente_id) || { cantidad: 0, total_gastado: 0 };
      grupo.cantidad++;
      grupo.total_gastado += r.precio;
      grupos.set(r.cliente_id, grupo);
    }

    return Array.from(grupos.entries())
      .map(([cliente_id, data]) => ({ cliente_id, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async utilidad(desde: number, hasta: number): Promise<Utilidad> {
    const registros = await this.registroRepo.buscarPorFecha(desde, hasta);
    const gastos = await this.gastoRepo.buscarPorFecha(desde, hasta);

    const ingresos = registros.reduce((sum, r) => sum + r.precio, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);

    return { ingresos, gastos: totalGastos, utilidad: ingresos - totalGastos };
  }
}
