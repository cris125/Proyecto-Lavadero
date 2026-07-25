import { useState, useEffect } from 'react';
import { Button, Input, Select, FormField } from '@/components/ui';
import { Eye, EyeOff } from 'lucide-react';
import type { Usuario } from '@/types';

interface UsuarioFormProps {
  initial: Usuario | null;
  onSave: (data: any) => void;
  loading?: boolean;
}

export function UsuarioForm({ initial, onSave, loading }: UsuarioFormProps) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', contraseña: '', rol: 'COLABORADOR' as 'ADMIN' | 'COLABORADOR',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({ nombre: initial.nombre, apellido: initial.apellido, email: initial.email, telefono: initial.telefono, contraseña: '', rol: initial.rol });
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (initial && !payload.contraseña) delete (payload as any).contraseña;
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" required>
          <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </FormField>
        <FormField label="Apellido" required>
          <Input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
        </FormField>
      </div>
      <FormField label="Email" required>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </FormField>
      <FormField label="Teléfono" required>
        <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} required />
      </FormField>
      <FormField label={initial ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'} required={!initial}>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} required={!initial}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-gray-400" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FormField>
      <FormField label="Rol" required>
        <Select
          options={[
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'COLABORADOR', label: 'Colaborador' },
          ]}
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value as any })}
        />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{initial ? 'Actualizar' : 'Crear usuario'}</Button>
      </div>
    </form>
  );
}
