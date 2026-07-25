import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCircle, Car, Package, Wrench, ClipboardList, BarChart3,
  Settings, Receipt, ChevronLeft, LogOut, User,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { to: '/usuarios', label: 'Usuarios', icon: Users, adminOnly: true },
  { to: '/clientes', label: 'Clientes', icon: UserCircle, adminOnly: false },
  { to: '/vehiculos', label: 'Vehículos', icon: Car, adminOnly: false },
  { to: '/productos', label: 'Productos', icon: Package, adminOnly: true },
  { to: '/servicios', label: 'Servicios', icon: Wrench, adminOnly: true },
  { to: '/registros', label: 'Lavados', icon: ClipboardList, adminOnly: false },
  { to: '/gastos', label: 'Gastos', icon: Receipt, adminOnly: true },
  { to: '/reportes', label: 'Reportes', icon: BarChart3, adminOnly: true },
  { to: '/perfil', label: 'Mi Perfil', icon: User, adminOnly: false },
  { to: '/configuracion', label: 'Configuración', icon: Settings, adminOnly: true },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onToggle }: SidebarProps) {
  const { isAdmin, usuario, logout } = useAuth();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-14 lg:h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <span className="text-base lg:text-lg font-bold text-gray-900">Lavadero</span>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:block p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {menuItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {usuario?.nombre?.charAt(0)}{usuario?.apellido?.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <p className="text-[10px] lg:text-xs text-gray-500 truncate">{usuario?.rol}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="mt-2 flex items-center gap-2 px-3 py-2 text-xs lg:text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}