import { Link } from 'react-router-dom';
import { Card } from '@/components/ui';
import { User, Lock, ChevronRight } from 'lucide-react';

export function ConfigPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Ajustes del sistema</p>
      </div>
      <Link to="/perfil" className="block">
        <Card hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Mi Perfil</h3>
                <p className="text-xs text-gray-500">Actualiza tu información personal y cambia tu contraseña</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </Link>
    </div>
  );
}
