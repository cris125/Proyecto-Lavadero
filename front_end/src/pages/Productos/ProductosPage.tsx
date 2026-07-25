import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerProductosApi, crearProductoApi, editarProductoApi, eliminarProductoApi } from '@/api/productos';
import { DataTable, Card, Button, Modal, Badge, ConfirmDialog, SearchBar } from '@/components/ui';
import { ProductoForm } from './ProductoForm';
import { useModal } from '@/hooks/useModal';
import type { Producto } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function ProductosPage() {
  const [search, setSearch] = useState(''); const [selected, setSelected] = useState<Producto | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null); const modal = useModal(); const confirmModal = useModal();
  const queryClient = useQueryClient();

  const { data: productos, isLoading } = useQuery({ queryKey: ['productos'], queryFn: obtenerProductosApi });
  const createMutation = useMutation({ mutationFn: crearProductoApi });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => editarProductoApi(id, data) });
  const deleteMutation = useMutation({ mutationFn: eliminarProductoApi });

  const filtered = (productos || []).filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (data: any) => {
    try {
      if (selected?.id) { await updateMutation.mutateAsync({ id: selected.id, data }); toast.success('Producto actualizado'); }
      else { await createMutation.mutateAsync(data); toast.success('Producto creado'); }
      queryClient.invalidateQueries({ queryKey: ['productos'] }); modal.close(); setSelected(null);
    } catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Error'); }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Producto eliminado');
      confirmModal.close(); setDeleteId(null);
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Productos</h1><p className="text-sm text-gray-500 mt-1">Inventario de productos</p></div>
        <Button onClick={() => { setSelected(null); modal.open(); }}><Plus className="w-4 h-4" /> Nuevo producto</Button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar producto..." />
      <Card>
        <DataTable
          columns={[
            { key: 'nombre', header: 'Nombre', sortable: true },
            { key: 'descripcion', header: 'Descripción' },
            { key: 'precio_venta', header: 'Precio venta', render: (p: Producto) => formatCurrency(p.precio_venta) },
            { key: 'cantidad', header: 'Stock', render: (p: Producto) => `${p.cantidad} ${p.unidad}` },
            { key: 'estado', header: 'Estado', render: (p: Producto) => <Badge variant={p.estado === 'disponible' ? 'success' : p.estado === 'agotado' ? 'danger' : 'warning'}>{p.estado}</Badge> },
            { key: 'acciones', header: '', render: (p: Producto) => (
              <div className="flex gap-1">
                <button onClick={() => { setSelected(p); modal.open(); }} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { setDeleteId(p.id!); confirmModal.open(); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            )},
          ]}
          data={filtered}
          loading={isLoading}
        />
      </Card>
      <Modal isOpen={modal.isOpen} onClose={() => { modal.close(); setSelected(null); }} title={selected ? 'Editar producto' : 'Nuevo producto'} size="lg">
        <ProductoForm initial={selected} onSave={handleSave} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={() => { confirmModal.close(); setDeleteId(null); }} onConfirm={handleDelete} title="Eliminar producto" message="¿Estás seguro?" loading={deleteMutation.isPending} />
    </div>
  );
}
