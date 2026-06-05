import { Navigate } from 'react-router-dom';
import type { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading || (!isAuthenticated && localStorage.getItem('accessToken'))) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement…</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
