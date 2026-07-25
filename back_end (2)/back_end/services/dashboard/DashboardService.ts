import { RegistroLavadoRepository } from '../../repository/registro_lavado_repository';
import { GastoRepository } from '../../repository/gasto_repository';
import { ClienteRepository } from '../../repository/cliente_repository';

export interface DashboardHoy {
  vehiculos_lavados: number;
  ingresos: number;
  servicios_mas_vendidos: { servicio_id: string; cantidad: number }[];
  colaborador_mas_lavados: { colaborador_id: string; cantidad: number };
}

export interface DashboardSemana {
  ingresos: number;
  vehiculos_atendidos: number;
}

export interface DashboardMes {
  ingresos: number;
  gastos: number;
  utilidad: number;
  clientes_nuevos: number;
}

export class DashboardService {
  constructor(
    private registroRepo: RegistroLavadoRepository,
    private gastoRepo: GastoRepository,
    private clienteRepo: ClienteRepository
  ) {}

  async obtenerDashboardHoy(): Promise<DashboardHoy> {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const registros = await this.registroRepo.buscarPorFecha(inicioDia.getTime(), finDia.getTime());

    const ingresos = registros.reduce((sum, r) => sum + r.precio, 0);
    const vehiculos_lavados = registros.length;

    const servicioCount = new Map<string, number>();
    for (const r of registros) {
      servicioCount.set(r.servicio_id, (servicioCount.get(r.servicio_id) || 0) + 1);
    }
    const servicios_mas_vendidos = Array.from(servicioCount.entries())
      .map(([servicio_id, cantidad]) => ({ servicio_id, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    const colaboradorCount = new Map<string, number>();
    for (const r of registros) {
      colaboradorCount.set(r.colaborador_id, (colaboradorCount.get(r.colaborador_id) || 0) + 1);
    }
    let colaborador_mas_lavados = { colaborador_id: '', cantidad: 0 };
    for (const [colaborador_id, cantidad] of colaboradorCount.entries()) {
      if (cantidad > colaborador_mas_lavados.cantidad) {
        colaborador_mas_lavados = { colaborador_id, cantidad };
      }
    }

    return { vehiculos_lavados, ingresos, servicios_mas_vendidos, colaborador_mas_lavados };
  }

  async obtenerDashboardSemana(): Promise<DashboardSemana> {
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - inicio.getDay());
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    const registros = await this.registroRepo.buscarPorFecha(inicio.getTime(), fin.getTime());
    const ingresos = registros.reduce((sum, r) => sum + r.precio, 0);
    const vehiculos_atendidos = registros.length;

    return { ingresos, vehiculos_atendidos };
  }

  async obtenerDashboardMes(): Promise<DashboardMes> {
    const inicio = new Date();
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    const registros = await this.registroRepo.buscarPorFecha(inicio.getTime(), fin.getTime());
    const gastos = await this.gastoRepo.buscarPorFecha(inicio.getTime(), fin.getTime());

    const ingresos = registros.reduce((sum, r) => sum + r.precio, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);

    const clientesMes = new Set(registros.map((r) => r.cliente_id)).size;
    const clientesNuevos = Math.max(0, clientesMes);

    return {
      ingresos,
      gastos: totalGastos,
      utilidad: ingresos - totalGastos,
      clientes_nuevos: clientesNuevos,
    };
  }
}
