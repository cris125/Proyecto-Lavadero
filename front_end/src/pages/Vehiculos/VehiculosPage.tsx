import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerVehiculosApi, crearVehiculoApi, editarVehiculoApi, eliminarVehiculoApi } from '@/api/vehiculos';
import { obtenerClientesApi } from '@/api/clientes';
import { DataTable, Card, Button, Modal, ConfirmDialog, SearchBar } from '@/components/ui';
import { VehiculoForm } from './VehiculoForm';
import { useModal } from '@/hooks/useModal';
import type { Vehiculo, Cliente } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function VehiculosPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Vehiculo | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const modal = useModal();
  const confirmModal = useModal();
  const queryClient = useQueryClient();

  const { data: vehiculos, isLoading } = useQuery({ queryKey: ['vehiculos'], queryFn: obtenerVehiculosApi });
  const { data: clientes } = useQuery({ queryKey: ['clientes'], queryFn: obtenerClientesApi });

  const createMutation = useMutation({ mutationFn: crearVehiculoApi });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => editarVehiculoApi(id, data) });
  const deleteMutation = useMutation({ mutationFn: eliminarVehiculoApi });

  const filtered = (vehiculos || []).filter((v) =>
    v.placa.toLowerCase().includes(search.toLowerCase()) || v.marca.toLowerCase().includes(search.toLowerCase())
  );

  const getPropietario = (id: string) => clientes?.find((c) => c.id === id);

  const handleSave = async (data: any) => {
    try {
      if (selected?.id) { await updateMutation.mutateAsync({ id: selected.id, data }); toast.success('Vehículo actualizado'); }
      else { await createMutation.mutateAsync(data); toast.success('Vehículo creado'); }
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] }); modal.close(); setSelected(null);
    } catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Error'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      toast.success('Vehículo eliminado');
      confirmModal.close(); setDeleteId(null);
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Vehículos</h1><p className="text-sm text-gray-500 mt-1">Registro de vehículos</p></div>
        <Button onClick={() => { setSelected(null); modal.open(); }}><Plus className="w-4 h-4" /> Nuevo vehículo</Button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por placa o marca..." />
      <Card>
        <DataTable
          columns={[
            { key: 'placa', header: 'Placa', sortable: true },
            { key: 'marca', header: 'Marca', sortable: true },
            { key: 'modelo', header: 'Modelo' },
            { key: 'color', header: 'Color' },
            { key: 'tipo', header: 'Tipo' },
            { key: 'propietario', header: 'Propietario', render: (v: Vehiculo) => getPropietario(v.propietario_id)?.nombre || '-' },
            { key: 'acciones', header: '', render: (v: Vehiculo) => (
              <div className="flex gap-1">
                <button onClick={() => { setSelected(v); modal.open(); }} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { setDeleteId(v.id!); confirmModal.open(); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            )},
          ]}
          data={filtered}
          loading={isLoading}
        />
      </Card>
      <Modal isOpen={modal.isOpen} onClose={() => { modal.close(); setSelected(null); }} title={selected ? 'Editar vehículo' : 'Nuevo vehículo'} size="lg">
        <VehiculoForm initial={selected} clientes={clientes || []} onSave={handleSave} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={() => { confirmModal.close(); setDeleteId(null); }} onConfirm={handleDelete} title="Eliminar vehículo" message="¿Estás seguro?" loading={deleteMutation.isPending} />
    </div>
  );
}
