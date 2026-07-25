import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerRegistrosApi, crearRegistroApi } from '@/api/registros';
import { obtenerClientesApi } from '@/api/clientes';
import { obtenerVehiculosApi } from '@/api/vehiculos';
import { obtenerUsuariosApi } from '@/api/usuarios';
import { obtenerServiciosActivosApi } from '@/api/servicios';
import { DataTable, Card, Button, Modal, Badge, SearchBar } from '@/components/ui';
import { RegistroForm } from './RegistroForm';
import { useModal } from '@/hooks/useModal';
import type { RegistroLavado } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export function RegistrosPage() {
  const [search, setSearch] = useState('');
  const modal = useModal();
  const queryClient = useQueryClient();

  const { data: registros, isLoading } = useQuery({ queryKey: ['registros'], queryFn: () => obtenerRegistrosApi() });
  const { data: clientes } = useQuery({ queryKey: ['clientes'], queryFn: obtenerClientesApi });
  const { data: vehiculos } = useQuery({ queryKey: ['vehiculos'], queryFn: obtenerVehiculosApi });
  const { data: colaboradores } = useQuery({ queryKey: ['usuarios'], queryFn: obtenerUsuariosApi });
  const { data: servicios } = useQuery({ queryKey: ['servicios'], queryFn: obtenerServiciosActivosApi });

  const createMutation = useMutation({ mutationFn: crearRegistroApi });

  const filtered = (registros || []).filter((r) =>
    r.placa?.toLowerCase().includes(search.toLowerCase()) || r.observaciones?.toLowerCase().includes(search.toLowerCase())
  );

  const getNombre = (list: any[], id: string) => list?.find((i: any) => i.id === id)?.nombre || id;

  const handleSave = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      queryClient.invalidateQueries({ queryKey: ['registros'] });
      toast.success('Lavado registrado');
      modal.close();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Error al registrar');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Registro de Lavados</h1><p className="text-sm text-gray-500 mt-1">Historial de servicios realizados</p></div>
        <Button onClick={() => modal.open()}><Plus className="w-4 h-4" /> Nuevo lavado</Button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por placa..." />
      <Card>
        <DataTable
          columns={[
            { key: 'fecha', header: 'Fecha', sortable: true, render: (r: RegistroLavado) => formatDateTime(r.fecha) },
            { key: 'cliente', header: 'Cliente', render: (r: RegistroLavado) => getNombre(clientes, r.cliente_id) },
            { key: 'colaborador', header: 'Colaborador', render: (r: RegistroLavado) => getNombre(colaboradores, r.colaborador_id) },
            { key: 'servicio', header: 'Servicio', render: (r: RegistroLavado) => getNombre(servicios, r.servicio_id) },
            { key: 'precio', header: 'Precio', render: (r: RegistroLavado) => formatCurrency(r.precio) },
            { key: 'hora', header: 'Hora' },
            { key: 'estado', header: 'Estado', render: (r: RegistroLavado) => <Badge variant={r.estado === 'completado' ? 'success' : 'danger'}>{r.estado}</Badge> },
          ]}
          data={filtered}
          loading={isLoading}
        />
      </Card>
      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Nuevo lavado" size="xl">
        <RegistroForm
          clientes={clientes || []}
          vehiculos={vehiculos || []}
          colaboradores={colaboradores || []}
          servicios={servicios || []}
          onSave={handleSave}
          loading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
