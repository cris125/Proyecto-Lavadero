import { useState, useEffect } from 'react';
import { Button, Input, FormField } from '@/components/ui';
import type { Producto } from '@/types';

interface Props { initial: Producto | null; onSave: (data: any) => void; loading?: boolean; }

export function ProductoForm({ initial, onSave, loading }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio_compra: 0, precio_venta: 0, cantidad: 0, unidad: 'unidad' });
  useEffect(() => {
    if (initial) setForm({ nombre: initial.nombre, descripcion: initial.descripcion, precio_compra: initial.precio_compra, precio_venta: initial.precio_venta, cantidad: initial.cantidad, unidad: initial.unidad });
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nombre" required><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></FormField>
      <FormField label="Descripción"><Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Precio compra" required><Input type="number" value={form.precio_compra} onChange={(e) => setForm({ ...form, precio_compra: Number(e.target.value) })} required /></FormField>
        <FormField label="Precio venta" required><Input type="number" value={form.precio_venta} onChange={(e) => setForm({ ...form, precio_venta: Number(e.target.value) })} required /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Cantidad" required><Input type="number" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })} required /></FormField>
        <FormField label="Unidad" required><Input value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} required /></FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{initial ? 'Actualizar' : 'Crear producto'}</Button>
      </div>
    </form>
  );
}
