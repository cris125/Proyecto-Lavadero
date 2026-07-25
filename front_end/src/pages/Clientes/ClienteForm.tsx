import { useState, useEffect } from 'react';
import { Button, Input, FormField } from '@/components/ui';
import type { Cliente } from '@/types';

interface Props { initial: Cliente | null; onSave: (data: any) => void; loading?: boolean; }

export function ClienteForm({ initial, onSave, loading }: Props) {
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', observaciones: '' });
  useEffect(() => {
    if (initial) setForm({ nombre: initial.nombre, telefono: initial.telefono, email: initial.email || '', observaciones: initial.observaciones });
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nombre" required><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></FormField>
      <FormField label="Teléfono" required><Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} required /></FormField>
      <FormField label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
      <FormField label="Observaciones"><Input value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} /></FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{initial ? 'Actualizar' : 'Crear cliente'}</Button>
      </div>
    </form>
  );
}
