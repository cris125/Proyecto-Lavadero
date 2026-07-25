import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventasApi, serviciosMasVendidosApi, colaboradoresProductividadApi, clientesFrecuentesApi, utilidadApi } from '@/api/reportes';
import { obtenerRegistrosApi } from '@/api/registros';
import { obtenerClientesApi } from '@/api/clientes';
import { obtenerUsuariosApi } from '@/api/usuarios';
import { obtenerVehiculosApi } from '@/api/vehiculos';
import { obtenerServiciosActivosApi } from '@/api/servicios';
import { Card, Button, DataTable, Loader } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

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

  const { data: registros, isLoading: l6 } = useQuery({
    queryKey: ['reportes', 'registros', desdeTs, hastaTs],
    queryFn: () => obtenerRegistrosApi({ desde: desdeTs, hasta: hastaTs }),
  });
  const { data: clientes, isLoading: l7 } = useQuery({
    queryKey: ['reportes', 'clientes'],
    queryFn: () => obtenerClientesApi(),
  });
  const { data: usuarios, isLoading: l8 } = useQuery({
    queryKey: ['reportes', 'usuarios'],
    queryFn: () => obtenerUsuariosApi(),
  });
  const { data: vehiculos, isLoading: l9 } = useQuery({
    queryKey: ['reportes', 'vehiculos'],
    queryFn: () => obtenerVehiculosApi(),
  });
  const { data: serviciosList, isLoading: l10 } = useQuery({
    queryKey: ['reportes', 'serviciosList'],
    queryFn: () => obtenerServiciosActivosApi(),
  });

  const isLoading = l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9 || l10;

  const clientesMap = new Map(clientes?.map((c: any) => [c.id, c.nombre || `${c.nombres || ''} ${c.apellidos || ''}`.trim()]));
  const usuariosMap = new Map(usuarios?.map((u: any) => [u.id, u.nombre || u.email]));
  const vehiculosMap = new Map(vehiculos?.map((v: any) => [v.id, v.placa]));
  const serviciosMap = new Map(serviciosList?.map((s: any) => [s.id, s.nombre]));

  const descargarExcel = useCallback(() => {
    const wb = XLSX.utils.book_new();

    if (registros?.length) {
      const detalle = registros.map((r: any) => {
        const comision = (r.precio ?? 0) * ((r.porcentaje_colaborador ?? 32) / 100);
        const utilidadDetalle = (r.precio ?? 0) - comision;
        return {
          Fecha: r.fecha ? new Date(r.fecha).toLocaleDateString() : '',
          Cliente: clientesMap.get(r.cliente_id) || r.cliente_id || '',
          'Teléfono cliente': clientes?.find((c: any) => c.id === r.cliente_id)?.telefono || '',
          Vehículo: vehiculosMap.get(r.vehiculo_id) || r.vehiculo_id || '',
          Servicio: serviciosMap.get(r.servicio_id) || r.servicio_id || '',
          Colaborador: usuariosMap.get(r.colaborador_id) || r.colaborador_id || '',
          Precio: r.precio ?? 0,
          'Comisión %': r.porcentaje_colaborador ?? 32,
          'Comisión $': comision,
          Utilidad: utilidadDetalle,
        };
      });
      const ws = XLSX.utils.json_to_sheet(detalle);
      ws['!cols'] = [
        { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
        { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'Detalle de lavados');
    }

    if (ventas?.length) {
      const ws1 = XLSX.utils.json_to_sheet(ventas.map((v) => ({ Fecha: v.fecha, Cantidad: v.cantidad, Total: v.total })));
      XLSX.utils.book_append_sheet(wb, ws1, 'Ventas');
    }
    if (servicios?.length) {
      const ws2 = XLSX.utils.json_to_sheet(servicios.map((s) => ({ Servicio: serviciosMap.get(s.servicio_id) || s.servicio_id, Cantidad: s.cantidad, Total: s.total })));
      XLSX.utils.book_append_sheet(wb, ws2, 'Servicios');
    }
    if (colaboradores?.length) {
      const ws3 = XLSX.utils.json_to_sheet(colaboradores.map((c) => ({ Colaborador: usuariosMap.get(c.colaborador_id) || c.colaborador_id, Lavados: c.cantidad, Total: c.total })));
      XLSX.utils.book_append_sheet(wb, ws3, 'Colaboradores');
    }
    if (clientesFrec?.length) {
      const ws4 = XLSX.utils.json_to_sheet(clientesFrec.map((c) => ({ Cliente: clientesMap.get(c.cliente_id) || c.cliente_id, Visitas: c.cantidad, 'Total gastado': c.total_gastado })));
      XLSX.utils.book_append_sheet(wb, ws4, 'Clientes frecuentes');
    }
    if (utilidad) {
      const ws5 = XLSX.utils.json_to_sheet([{ Ingresos: utilidad.ingresos, Gastos: utilidad.gastos, Utilidad: utilidad.utilidad }]);
      XLSX.utils.book_append_sheet(wb, ws5, 'Utilidad');
    }
    XLSX.writeFile(wb, `reporte_${desde}_a_${hasta}.xlsx`);
    toast.success('Reporte descargado');
  }, [ventas, servicios, colaboradores, clientesFrec, utilidad, registros, clientes, clientesMap, usuariosMap, vehiculosMap, serviciosMap, desde, hasta]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Reportes</h1><p className="text-sm text-gray-500 mt-1">Análisis y estadísticas</p></div>
        <Button onClick={descargarExcel} disabled={isLoading}><Download className="w-4 h-4" /> Descargar Excel</Button>
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
