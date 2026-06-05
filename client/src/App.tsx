import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBons from './pages/admin/AdminBons';
import AdminStats from './pages/admin/AdminStats';
import Catalogue from './pages/employee/Catalogue';
import Profil from './pages/employee/Profil';
import Parameters from './pages/employee/Parameters';
import Historique from './pages/Historique';
import Panier from './pages/Panier';
import Service from './pages/Service';
import Abonnement from './pages/Abonnement';

function HomeRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <HomePage />;
  if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/catalogue" replace />;
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Employer-only */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Layout><EmployerDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin-only */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/bons" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><AdminBons /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><AdminStats /></Layout>
            </ProtectedRoute>
          } />

          {/* All authenticated users */}
          <Route path="/catalogue" element={
            <ProtectedRoute>
              <Layout><Catalogue /></Layout>
            </ProtectedRoute>
          } />

          {/* All authenticated users */}
          <Route path="/profil"      element={<Wrap><Profil /></Wrap>} />
          <Route path="/parametres"  element={<Wrap><Parameters /></Wrap>} />
          <Route path="/historique"  element={<Wrap><Historique /></Wrap>} />
          <Route path="/panier"      element={<Wrap><Panier /></Wrap>} />
          <Route path="/service"     element={<Wrap><Service /></Wrap>} />
          <Route path="/abonnement" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Layout><Abonnement /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
