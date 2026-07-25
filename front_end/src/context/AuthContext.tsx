import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Usuario } from '@/types';
import { loginApi, registerApi } from '@/api/auth';

interface AuthState {
  usuario: Omit<Usuario, 'contraseña'> | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: (email: string, contraseña: string) => Promise<string>;
  register: (data: { nombre: string; apellido: string; email: string; telefono: string; contraseña: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Omit<Usuario, 'contraseña'> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsuario = localStorage.getItem('usuario');
    if (savedToken && savedUsuario) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUsuario));
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (email: string, contraseña: string) => {
    const result = await loginApi(email, contraseña);
    setUsuario(result.usuario);
    setToken(result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('usuario', JSON.stringify(result.usuario));
    return result.usuario.rol;
  };

  const register = async (data: { nombre: string; apellido: string; email: string; telefono: string; contraseña: string }) => {
    const result = await registerApi(data);
    setUsuario(result.usuario);
    setToken(result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('usuario', JSON.stringify(result.usuario));
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token,
        isAdmin: usuario?.rol === 'ADMIN',
        isAuthLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
