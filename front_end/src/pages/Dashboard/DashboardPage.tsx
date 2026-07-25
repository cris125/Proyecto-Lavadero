import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { obtenerDashboardHoyApi, obtenerDashboardSemanaApi, obtenerDashboardMesApi } from '@/api/dashboard';
import { ventasApi } from '@/api/reportes';
import { Card, Loader } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { Car, DollarSign, TrendingUp, Clock, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function toDateInput(d: Date) {
  return d.toISOString().split('T')[0];
}

export function DashboardPage() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [desde, setDesde] = useState(toDateInput(weekAgo));
  const [hasta, setHasta] = useState(toDateInput(today));

  const desdeTs = new Date(desde).getTime();
  const hastaTs = new Date(hasta + 'T23:59:59').getTime();

  const { data: hoy, isLoading: loadingHoy } = useQuery({ queryKey: ['dashboard', 'hoy'], queryFn: obtenerDashboardHoyApi });
  const { data: semana, isLoading: loadingSemana } = useQuery({ queryKey: ['dashboard', 'semana'], queryFn: obtenerDashboardSemanaApi });
  const { data: mes, isLoading: loadingMes } = useQuery({ queryKey: ['dashboard', 'mes'], queryFn: obtenerDashboardMesApi });
  const { data: ventas, isLoading: loadingVentas } = useQuery({
    queryKey: ['ventas', desdeTs, hastaTs],
    queryFn: () => ventasApi(desdeTs, hastaTs, 'dia'),
  });

  if (loadingHoy || loadingSemana || loadingMes) return <Loader />;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-xs lg:text-sm text-gray-500 mt-0.5 lg:mt-1">Resumen del lavadero</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        <StatCard icon={Car} label="Vehículos hoy" value={hoy?.vehiculos_lavados ?? 0} color="blue" />
        <StatCard icon={DollarSign} label="Ingresos hoy" value={formatCurrency(hoy?.ingresos ?? 0)} color="green" />
        <StatCard icon={TrendingUp} label="Utilidad mes" value={formatCurrency(mes?.utilidad ?? 0)} color={mes && mes.utilidad >= 0 ? 'green' : 'red'} />
        <StatCard icon={Clock} label="Vehículos (semana)" value={semana?.vehiculos_atendidos ?? 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6">
        <Card title="Hoy" subtitle="Resumen del día">
          <div className="space-y-2 lg:space-y-3">
            <Metric label="Ingresos" value={formatCurrency(hoy?.ingresos ?? 0)} />
            <Metric label="Vehículos" value={String(hoy?.vehiculos_lavados ?? 0)} />
            <Metric label="Top Colaborador" value={hoy?.colaborador_mas_lavados?.colaborador_id ? `${hoy.colaborador_mas_lavados.cantidad} lavados` : 'N/A'} />
          </div>
        </Card>

        <Card title="Semana" subtitle="Últimos 7 días" icon={<Calendar className="w-4 h-4 text-gray-400" />}>
          <div className="space-y-2 lg:space-y-3">
            <Metric label="Ingresos" value={formatCurrency(semana?.ingresos ?? 0)} />
            <Metric label="Vehículos atendidos" value={String(semana?.vehiculos_atendidos ?? 0)} />
          </div>
        </Card>

        <Card title="Mes" subtitle="Este mes">
          <div className="space-y-2 lg:space-y-3">
            <Metric label="Ingresos" value={formatCurrency(mes?.ingresos ?? 0)} />
            <Metric label="Gastos" value={formatCurrency(mes?.gastos ?? 0)} />
            <Metric label="Utilidad" value={formatCurrency(mes?.utilidad ?? 0)} />
            <Metric label="Clientes nuevos" value={String(mes?.clientes_nuevos ?? 0)} />
          </div>
        </Card>
      </div>

      <Card title="Ganancias por período" icon={<BarChart3 className="w-4 h-4 text-gray-400" />}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3 lg:mb-4">
          <div>
            <label className="block text-[10px] lg:text-xs font-medium text-gray-500 mb-0.5">Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)}
              className="rounded-lg border border-gray-300 px-2.5 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-[10px] lg:text-xs font-medium text-gray-500 mb-0.5">Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)}
              className="rounded-lg border border-gray-300 px-2.5 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {loadingVentas ? (
          <Loader />
        ) : ventas && ventas.length > 0 ? (
          <ResponsiveContainer width="100%" height={200} minHeight={200}>
            <BarChart data={ventas} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(value: number) => [`$${value}`, 'Ganancias']} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs lg:text-sm text-gray-400 text-center py-6 lg:py-8">Sin datos para el período seleccionado</p>
        )}
      </Card>

      {hoy && hoy.servicios_mas_vendidos.length > 0 && (
        <Card title="Servicios más vendidos hoy">
          <div className="space-y-1 lg:space-y-2">
            {hoy.servicios_mas_vendidos.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-0.5 lg:py-1">
                <span className="text-xs lg:text-sm text-gray-600">{s.servicio_id}</span>
                <span className="text-xs lg:text-sm font-medium text-gray-900">{s.cantidad} lavados</span>
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
    <div className="bg-white rounded-lg lg:rounded-xl border border-gray-200 p-3 lg:p-5 flex items-center gap-2 lg:gap-4">
      <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color] || colors.blue}`}>
        <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] lg:text-sm text-gray-500 truncate">{label}</p>
        <p className="text-sm lg:text-xl font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] lg:text-sm text-gray-500">{label}</span>
      <span className="text-[11px] lg:text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
