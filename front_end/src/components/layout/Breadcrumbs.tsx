import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  clientes: 'Clientes',
  vehiculos: 'Vehículos',
  productos: 'Productos',
  servicios: 'Servicios',
  registros: 'Lavados',
  gastos: 'Gastos',
  reportes: 'Reportes',
  configuracion: 'Configuración',
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      <Link to="/dashboard" className="hover:text-gray-700">
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/');
        const label = labels[seg] || seg;
        const isLast = idx === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{label}</span>
            ) : (
              <Link to={path} className="hover:text-gray-700">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
