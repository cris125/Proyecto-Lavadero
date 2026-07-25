import { useState, useEffect } from 'react';
import { Button, Input, Select, FormField } from '@/components/ui';
import type { Vehiculo, Cliente } from '@/types';

interface Props { initial: Vehiculo | null; clientes: Cliente[]; onSave: (data: any) => void; loading?: boolean; }

export function VehiculoForm({ initial, clientes, onSave, loading }: Props) {
  const [form, setForm] = useState({ placa: '', marca: '', modelo: '', color: '', tipo: '', propietario_id: '' });
  useEffect(() => {
    if (initial) setForm({ placa: initial.placa, marca: initial.marca, modelo: initial.modelo, color: initial.color, tipo: initial.tipo, propietario_id: initial.propietario_id });
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Placa" required><Input value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} required /></FormField>
        <FormField label="Marca" required><Input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Modelo"><Input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} /></FormField>
        <FormField label="Color"><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tipo" required>
          <Select options={[
            { value: 'Sedán', label: 'Sedán' }, { value: 'Camioneta', label: 'Camioneta' },
            { value: 'SUV', label: 'SUV' }, { value: 'Moto', label: 'Moto' },
            { value: 'Camión', label: 'Camión' }, { value: 'Otro', label: 'Otro' },
          ]} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
        </FormField>
        <FormField label="Propietario" required>
          <Select options={clientes.map((c) => ({ value: c.id!, label: c.nombre }))} value={form.propietario_id} onChange={(e) => setForm({ ...form, propietario_id: e.target.value })} placeholder="Seleccionar cliente" />
        </FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{initial ? 'Actualizar' : 'Crear vehículo'}</Button>
      </div>
    </form>
  );
}
