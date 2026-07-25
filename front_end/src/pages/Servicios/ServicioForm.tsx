import { useState, useEffect } from 'react';
import { Button, Input, FormField } from '@/components/ui';
import type { Servicio } from '@/types';

interface Props { initial: Servicio | null; onSave: (data: any) => void; loading?: boolean; }

export function ServicioForm({ initial, onSave, loading }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: 0, duracion: 30 });
  useEffect(() => {
    if (initial) setForm({ nombre: initial.nombre, descripcion: initial.descripcion, precio: initial.precio, duracion: initial.duracion });
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nombre" required><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></FormField>
      <FormField label="Descripción"><Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Precio" required><Input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} required /></FormField>
        <FormField label="Duración (min)" required><Input type="number" value={form.duracion} onChange={(e) => setForm({ ...form, duracion: Number(e.target.value) })} required /></FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{initial ? 'Actualizar' : 'Crear servicio'}</Button>
      </div>
    </form>
  );
}
