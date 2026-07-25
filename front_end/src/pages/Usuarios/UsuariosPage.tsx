import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obtenerUsuariosApi, crearUsuarioApi, editarUsuarioApi, eliminarUsuarioApi } from '@/api/usuarios';
import { DataTable, Card, Button, Modal, Badge, ConfirmDialog, SearchBar } from '@/components/ui';
import { UsuarioForm } from './UsuarioForm';
import { useModal } from '@/hooks/useModal';
import type { Usuario } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function UsuariosPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const modal = useModal();
  const confirmModal = useModal();
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: obtenerUsuariosApi,
  });

  const createMutation = useMutation({ mutationFn: crearUsuarioApi });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => editarUsuarioApi(id, data) });
  const deleteMutation = useMutation({ mutationFn: eliminarUsuarioApi });

  const filtered = (usuarios || []).filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: any) => {
    try {
      if (selected?.id) {
        await updateMutation.mutateAsync({ id: selected.id, data });
        toast.success('Usuario actualizado');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Usuario creado');
      }
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      modal.close();
      setSelected(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario eliminado');
      confirmModal.close();
      setDeleteId(null);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={() => { setSelected(null); modal.open(); }}>
          <Plus className="w-4 h-4" /> Nuevo usuario
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o email..." />

      <Card>
        <DataTable
          columns={[
            { key: 'nombre', header: 'Nombre', sortable: true, render: (u: Usuario) => `${u.nombre} ${u.apellido}` },
            { key: 'email', header: 'Email', sortable: true },
            { key: 'telefono', header: 'Teléfono' },
            {
              key: 'rol', header: 'Rol', render: (u: Usuario) => (
                <Badge variant={u.rol === 'ADMIN' ? 'info' : 'neutral'}>{u.rol}</Badge>
              ),
            },
            {
              key: 'estado', header: 'Estado', render: (u: Usuario) => (
                <Badge variant={u.estado === 'activo' ? 'success' : 'danger'}>{u.estado}</Badge>
              ),
            },
            {
              key: 'acciones', header: '', render: (u: Usuario) => (
                <div className="flex gap-1">
                  <button onClick={() => { setSelected(u); modal.open(); }} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setDeleteId(u.id!); confirmModal.open(); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={filtered}
          loading={isLoading}
        />
      </Card>

      <Modal isOpen={modal.isOpen} onClose={() => { modal.close(); setSelected(null); }} title={selected ? 'Editar usuario' : 'Nuevo usuario'} size="lg">
        <UsuarioForm initial={selected} onSave={handleSave} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => { confirmModal.close(); setDeleteId(null); }}
        onConfirm={handleDelete}
        title="Eliminar usuario"
        message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
