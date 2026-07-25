import { useState } from 'react';
import { Button, Input, Select, FormField } from '@/components/ui';
import type { Cliente, Vehiculo, Usuario, Servicio } from '@/types';

interface Props {
  clientes: Cliente[]; vehiculos: Vehiculo[]; colaboradores: Usuario[]; servicios: Servicio[];
  onSave: (data: any) => void; loading?: boolean;
}

export function RegistroForm({ clientes, vehiculos, colaboradores, servicios, onSave, loading }: Props) {
  const [form, setForm] = useState({ cliente_id: '', vehiculo_id: '', colaborador_id: '', servicio_id: '', precio: 0, observaciones: '', porcentaje_colaborador: 32 });

  const servicioSeleccionado = servicios.find((s) => s.id === form.servicio_id);
  const comision = (form.precio * form.porcentaje_colaborador) / 100;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, precio: servicioSeleccionado?.precio || form.precio }); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Cliente" required>
          <Select options={clientes.map((c) => ({ value: c.id!, label: `${c.nombre} - ${c.telefono}` }))} value={form.cliente_id}
            onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} placeholder="Seleccionar cliente" />
        </FormField>
        <FormField label="Vehículo" required>
          <Select options={vehiculos.filter((v) => !form.cliente_id || v.propietario_id === form.cliente_id).map((v) => ({ value: v.id!, label: `${v.placa} - ${v.marca} ${v.modelo}` }))} value={form.vehiculo_id}
            onChange={(e) => setForm({ ...form, vehiculo_id: e.target.value })} placeholder="Seleccionar vehículo" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Colaborador" required>
          <Select options={colaboradores.filter((u) => u.rol === 'COLABORADOR').map((u) => ({ value: u.id!, label: `${u.nombre} ${u.apellido}` }))} value={form.colaborador_id}
            onChange={(e) => setForm({ ...form, colaborador_id: e.target.value })} placeholder="Seleccionar colaborador" />
        </FormField>
        <FormField label="Servicio" required>
          <Select options={servicios.map((s) => ({ value: s.id!, label: `${s.nombre} - ${s.precio.toLocaleString('es-CO')}` }))} value={form.servicio_id}
            onChange={(e) => setForm({ ...form, servicio_id: e.target.value, precio: servicios.find((s) => s.id === e.target.value)?.precio || 0 })} placeholder="Seleccionar servicio" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Precio" required>
          <Input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} required />
        </FormField>
        <FormField label="% Colaborador" required>
          <Input type="number" value={form.porcentaje_colaborador} onChange={(e) => setForm({ ...form, porcentaje_colaborador: Number(e.target.value) })} min={0} max={100} required />
        </FormField>
      </div>
      <div className="text-xs text-gray-500 text-right">Comisión: <span className="font-semibold text-gray-700">${comision.toLocaleString('es-CO')}</span></div>
      <FormField label="Observaciones"><Input value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} /></FormField>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>Registrar lavado</Button>
      </div>
    </form>
  );
}
