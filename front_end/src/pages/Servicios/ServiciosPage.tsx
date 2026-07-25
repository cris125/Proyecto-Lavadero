import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerServiciosApi, crearServicioApi, editarServicioApi, eliminarServicioApi } from '@/api/servicios';
import { DataTable, Card, Button, Modal, Badge, ConfirmDialog, SearchBar } from '@/components/ui';
import { ServicioForm } from './ServicioForm';
import { useModal } from '@/hooks/useModal';
import type { Servicio } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function ServiciosPage() {
  const [search, setSearch] = useState(''); const [selected, setSelected] = useState<Servicio | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null); const modal = useModal(); const confirmModal = useModal();
  const queryClient = useQueryClient();

  const { data: servicios, isLoading } = useQuery({ queryKey: ['servicios'], queryFn: obtenerServiciosApi });
  const createMutation = useMutation({ mutationFn: crearServicioApi });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => editarServicioApi(id, data) });
  const deleteMutation = useMutation({ mutationFn: eliminarServicioApi });

  const filtered = (servicios || []).filter((s) => s.nombre.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (data: any) => {
    try {
      if (selected?.id) { await updateMutation.mutateAsync({ id: selected.id, data }); toast.success('Servicio actualizado'); }
      else { await createMutation.mutateAsync(data); toast.success('Servicio creado'); }
      queryClient.invalidateQueries({ queryKey: ['servicios'] }); modal.close(); setSelected(null);
    } catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Error'); }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      toast.success('Servicio eliminado');
      confirmModal.close(); setDeleteId(null);
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Servicios</h1><p className="text-sm text-gray-500 mt-1">Catálogo de servicios ofrecidos</p></div>
        <Button onClick={() => { setSelected(null); modal.open(); }}><Plus className="w-4 h-4" /> Nuevo servicio</Button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar servicio..." />
      <Card>
        <DataTable
          columns={[
            { key: 'nombre', header: 'Nombre', sortable: true },
            { key: 'descripcion', header: 'Descripción' },
            { key: 'precio', header: 'Precio', render: (s: Servicio) => formatCurrency(s.precio) },
            { key: 'duracion', header: 'Duración (min)' },
            { key: 'estado', header: 'Estado', render: (s: Servicio) => <Badge variant={s.estado === 'activo' ? 'success' : 'neutral'}>{s.estado}</Badge> },
            { key: 'acciones', header: '', render: (s: Servicio) => (
              <div className="flex gap-1">
                <button onClick={() => { setSelected(s); modal.open(); }} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { setDeleteId(s.id!); confirmModal.open(); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            )},
          ]}
          data={filtered}
          loading={isLoading}
        />
      </Card>
      <Modal isOpen={modal.isOpen} onClose={() => { modal.close(); setSelected(null); }} title={selected ? 'Editar servicio' : 'Nuevo servicio'} size="lg">
        <ServicioForm initial={selected} onSave={handleSave} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={() => { confirmModal.close(); setDeleteId(null); }} onConfirm={handleDelete} title="Eliminar servicio" message="¿Estás seguro?" loading={deleteMutation.isPending} />
    </div>
  );
}
