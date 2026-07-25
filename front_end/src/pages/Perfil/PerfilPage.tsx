import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Button } from '@/components/ui';
import { actualizarPerfilApi, cambiarPasswordApi } from '@/api/usuarios';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function PerfilPage() {
  const { usuario, login } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [apellido, setApellido] = useState(usuario?.apellido || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [saving, setSaving] = useState(false);

  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changing, setChanging] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await actualizarPerfilApi({ nombre, apellido, telefono });
      toast.success('Perfil actualizado');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contraseñaActual || !nuevaContraseña) {
      toast.error('Ambos campos son obligatorios');
      return;
    }
    setChanging(true);
    try {
      await cambiarPasswordApi({ contraseñaActual, nuevaContraseña });
      toast.success('Contraseña cambiada correctamente');
      setContraseñaActual('');
      setNuevaContraseña('');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Error al cambiar contraseña');
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Administra tu información personal y seguridad</p>
      </div>

      <Card title="Información personal" icon={<User className="w-4 h-4 text-gray-400" />}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={usuario?.email || ''} disabled
              className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>Guardar cambios</Button>
          </div>
        </form>
      </Card>

      <Card title="Cambiar contraseña" icon={<Lock className="w-4 h-4 text-gray-400" />}>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={contraseñaActual}
                onChange={(e) => setContraseñaActual(e.target.value)} placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={nuevaContraseña}
                onChange={(e) => setNuevaContraseña(e.target.value)} placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={changing}>Cambiar contraseña</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}