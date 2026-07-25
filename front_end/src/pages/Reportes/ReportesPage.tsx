import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventasApi, serviciosMasVendidosApi, colaboradoresProductividadApi, clientesFrecuentesApi, utilidadApi } from '@/api/reportes';
import { Card, Button, DataTable, Loader } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export function ReportesPage() {
  const [desde, setDesde] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0];
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split('T')[0]);
  const desdeTs = new Date(desde).getTime();
  const hastaTs = new Date(hasta + 'T23:59:59').getTime();

  const { data: ventas, isLoading: l1 } = useQuery({
    queryKey: ['reportes', 'ventas', desdeTs, hastaTs],
    queryFn: () => ventasApi(desdeTs, hastaTs, 'dia'),
  });
  const { data: servicios, isLoading: l2 } = useQuery({
    queryKey: ['reportes', 'servicios', desdeTs, hastaTs],
    queryFn: () => serviciosMasVendidosApi(desdeTs, hastaTs),
  });
  const { data: colaboradores, isLoading: l3 } = useQuery({
    queryKey: ['reportes', 'colaboradores', desdeTs, hastaTs],
    queryFn: () => colaboradoresProductividadApi(desdeTs, hastaTs),
  });
  const { data: clientesFrec, isLoading: l4 } = useQuery({
    queryKey: ['reportes', 'clientes', desdeTs, hastaTs],
    queryFn: () => clientesFrecuentesApi(desdeTs, hastaTs),
  });
  const { data: utilidad, isLoading: l5 } = useQuery({
    queryKey: ['reportes', 'utilidad', desdeTs, hastaTs],
    queryFn: () => utilidadApi(desdeTs, hastaTs),
  });

  const isLoading = l1 || l2 || l3 || l4 || l5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Reportes</h1><p className="text-sm text-gray-500 mt-1">Análisis y estadísticas</p></div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Desde</label><input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label><input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
      </div>

      {isLoading ? <Loader /> : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Utilidad del período">
              <div className="space-y-2">
                <Metric label="Ingresos" value={formatCurrency(utilidad?.ingresos ?? 0)} />
                <Metric label="Gastos" value={formatCurrency(utilidad?.gastos ?? 0)} />
                <Metric label="Utilidad" value={formatCurrency(utilidad?.utilidad ?? 0)} />
              </div>
            </Card>
            <Card title="Ventas por día">
              {ventas && ventas.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ventas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-gray-500">Sin datos</p>}
            </Card>
            <Card title="Servicios más vendidos">
              {servicios && servicios.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={servicios.slice(0, 6)} dataKey="cantidad" nameKey="servicio_id" cx="50%" cy="50%" outerRadius={80}>
                      {servicios.slice(0, 6).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-gray-500">Sin datos</p>}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Productividad de colaboradores">
              <DataTable
                columns={[
                  { key: 'colaborador_id', header: 'Colaborador' },
                  { key: 'cantidad', header: 'Lavados' },
                  { key: 'total', header: 'Total', render: (r: any) => formatCurrency(r.total) },
                ]}
                data={colaboradores || []}
              />
            </Card>
            <Card title="Clientes frecuentes">
              <DataTable
                columns={[
                  { key: 'cliente_id', header: 'Cliente' },
                  { key: 'cantidad', header: 'Visitas' },
                  { key: 'total_gastado', header: 'Total gastado', render: (r: any) => formatCurrency(r.total_gastado) },
                ]}
                data={clientesFrec || []}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-sm text-gray-500">{label}</span><span className="text-sm font-semibold">{value}</span></div>;
}
