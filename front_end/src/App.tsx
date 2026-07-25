import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { AppRouter } from '@/routes/AppRouter';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#f9fafb',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
