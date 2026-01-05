import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/admin/Login';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Settings } from './pages/admin/Settings';

// Componente para proteger rutas (Guardian)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider> {/* 1. Proveedor de Autenticación primero */}
        <CartProvider>
          <ToastProvider>
            <Routes>

              {/* RUTA PÚBLICA (CLIENTES) */}
              <Route path="/" element={
                <Layout>
                  <Home />
                </Layout>
              } />

              {/* RUTA LOGIN */}
              <Route path="/admin/login" element={<Login />} />

              {/* RUTA PROTEGIDA (PANEL DE ADMIN) */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              {/* CUALQUIER OTRA RUTA -> HOME */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}