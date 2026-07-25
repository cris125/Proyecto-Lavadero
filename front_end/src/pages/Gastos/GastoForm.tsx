import { useState } from 'react';
import { Button, Input, Select, FormField } from '@/components/ui';

interface Props { onSave: (data: any) => void; loading?: boolean; }

export function GastoForm({ onSave, loading }: Props) {
  const [form, setForm] = useState({ concepto: '', monto: 0, categoria: 'Insumos', fecha: Date.now() });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <FormField label="Concepto" required><Input value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} required /></FormField>
      <FormField label="Monto" required><Input type="number" value={form.monto} onChange={(e) => setForm({ ...form, monto: Number(e.target.value) })} required /></FormField>
      <FormField label="Categoría" required>
        <Select options={[
          { value: 'Insumos', label: 'Insumos' }, { value: 'Servicios', label: 'Servicios' },
          { value: 'Mantenimiento', label: 'Mantenimiento' }, { value: 'Nomina', label: 'Nómina' },
          { value: 'Otros', label: 'Otros' },
        ]} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>Registrar gasto</Button>
      </div>
    </form>
  );
}
