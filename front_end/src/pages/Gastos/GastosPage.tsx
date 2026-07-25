import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerGastosApi, crearGastoApi, eliminarGastoApi } from '@/api/gastos';
import { DataTable, Card, Button, Modal, ConfirmDialog, SearchBar } from '@/components/ui';
import { GastoForm } from './GastoForm';
import { useModal } from '@/hooks/useModal';
import type { Gasto } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export function GastosPage() {
  const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<string | null>(null);
  const modal = useModal(); const confirmModal = useModal();
  const queryClient = useQueryClient();

  const { data: gastos, isLoading } = useQuery({ queryKey: ['gastos'], queryFn: () => obtenerGastosApi() });
  const createMutation = useMutation({ mutationFn: crearGastoApi });
  const deleteMutation = useMutation({ mutationFn: eliminarGastoApi });

  const filtered = (gastos || []).filter((g) => g.concepto.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      toast.success('Gasto registrado'); modal.close();
    } catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Error'); }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      toast.success('Gasto eliminado');
      confirmModal.close(); setDeleteId(null);
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Gastos</h1><p className="text-sm text-gray-500 mt-1">Control de gastos operativos</p></div>
        <Button onClick={() => modal.open()}><Plus className="w-4 h-4" /> Nuevo gasto</Button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar gasto..." />
      <Card>
        <DataTable
          columns={[
            { key: 'concepto', header: 'Concepto', sortable: true },
            { key: 'categoria', header: 'Categoría' },
            { key: 'monto', header: 'Monto', render: (g: Gasto) => formatCurrency(g.monto) },
            { key: 'fecha', header: 'Fecha', render: (g: Gasto) => formatDate(g.fecha) },
            { key: 'acciones', header: '', render: (g: Gasto) => (
              <button onClick={() => { setDeleteId(g.id!); confirmModal.open(); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            )},
          ]}
          data={filtered}
          loading={isLoading}
        />
      </Card>
      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Nuevo gasto"><GastoForm onSave={handleSave} loading={createMutation.isPending} /></Modal>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={() => { confirmModal.close(); setDeleteId(null); }} onConfirm={handleDelete} title="Eliminar gasto" message="¿Estás seguro?" loading={deleteMutation.isPending} />
    </div>
  );
}
