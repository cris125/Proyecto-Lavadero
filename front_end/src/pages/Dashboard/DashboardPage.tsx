import { useQuery } from '@tanstack/react-query';
import { obtenerDashboardHoyApi, obtenerDashboardSemanaApi, obtenerDashboardMesApi } from '@/api/dashboard';
import { Card } from '@/components/ui';
import { Loader } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { Car, DollarSign, TrendingUp, Users, Clock, Calendar } from 'lucide-react';

export function DashboardPage() {
  const { data: hoy, isLoading: loadingHoy } = useQuery({ queryKey: ['dashboard', 'hoy'], queryFn: obtenerDashboardHoyApi });
  const { data: semana, isLoading: loadingSemana } = useQuery({ queryKey: ['dashboard', 'semana'], queryFn: obtenerDashboardSemanaApi });
  const { data: mes, isLoading: loadingMes } = useQuery({ queryKey: ['dashboard', 'mes'], queryFn: obtenerDashboardMesApi });

  if (loadingHoy || loadingSemana || loadingMes) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen del lavadero</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Car} label="Vehículos hoy" value={hoy?.vehiculos_lavados ?? 0} color="blue" />
        <StatCard icon={DollarSign} label="Ingresos hoy" value={formatCurrency(hoy?.ingresos ?? 0)} color="green" />
        <StatCard icon={TrendingUp} label="Utilidad del mes" value={formatCurrency(mes?.utilidad ?? 0)} color={mes && mes.utilidad >= 0 ? 'green' : 'red'} />
        <StatCard icon={Clock} label="Vehículos (semana)" value={semana?.vehiculos_atendidos ?? 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Hoy" subtitle="Resumen del día">
          <div className="space-y-3">
            <Metric label="Ingresos" value={formatCurrency(hoy?.ingresos ?? 0)} />
            <Metric label="Vehículos" value={String(hoy?.vehiculos_lavados ?? 0)} />
            <Metric label="Top Colaborador" value={hoy?.colaborador_mas_lavados?.colaborador_id ? `${hoy.colaborador_mas_lavados.cantidad} lavados` : 'N/A'} />
          </div>
        </Card>

        <Card title="Semana" subtitle="Últimos 7 días" icon={<Calendar className="w-4 h-4 text-gray-400" />}>
          <div className="space-y-3">
            <Metric label="Ingresos" value={formatCurrency(semana?.ingresos ?? 0)} />
            <Metric label="Vehículos atendidos" value={String(semana?.vehiculos_atendidos ?? 0)} />
          </div>
        </Card>

        <Card title="Mes" subtitle="Este mes">
          <div className="space-y-3">
            <Metric label="Ingresos" value={formatCurrency(mes?.ingresos ?? 0)} />
            <Metric label="Gastos" value={formatCurrency(mes?.gastos ?? 0)} />
            <Metric label="Utilidad" value={formatCurrency(mes?.utilidad ?? 0)} />
            <Metric label="Clientes nuevos" value={String(mes?.clientes_nuevos ?? 0)} />
          </div>
        </Card>
      </div>

      {hoy && hoy.servicios_mas_vendidos.length > 0 && (
        <Card title="Servicios más vendidos hoy">
          <div className="space-y-2">
            {hoy.servicios_mas_vendidos.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-600">{s.servicio_id}</span>
                <span className="text-sm font-medium text-gray-900">{s.cantidad} lavados</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color] || colors.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
