import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/Login/LoginPage';
import { RegisterPage } from '@/pages/Register/RegisterPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { UsuariosPage } from '@/pages/Usuarios/UsuariosPage';
import { ClientesPage } from '@/pages/Clientes/ClientesPage';
import { VehiculosPage } from '@/pages/Vehiculos/VehiculosPage';
import { ProductosPage } from '@/pages/Productos/ProductosPage';
import { ServiciosPage } from '@/pages/Servicios/ServiciosPage';
import { RegistrosPage } from '@/pages/Registros/RegistrosPage';
import { GastosPage } from '@/pages/Gastos/GastosPage';
import { ReportesPage } from '@/pages/Reportes/ReportesPage';
import { ConfigPage } from '@/pages/Configuracion/ConfigPage';
import { PerfilPage } from '@/pages/Perfil/PerfilPage';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

function RootRedirect() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/dashboard' : '/registros'} replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/usuarios" element={<ProtectedRoute requireAdmin><UsuariosPage /></ProtectedRoute>} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/vehiculos" element={<VehiculosPage />} />
          <Route path="/productos" element={<ProtectedRoute requireAdmin><ProductosPage /></ProtectedRoute>} />
          <Route path="/servicios" element={<ProtectedRoute requireAdmin><ServiciosPage /></ProtectedRoute>} />
          <Route path="/registros" element={<RegistrosPage />} />
          <Route path="/gastos" element={<ProtectedRoute requireAdmin><GastosPage /></ProtectedRoute>} />
          <Route path="/reportes" element={<ProtectedRoute requireAdmin><ReportesPage /></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
