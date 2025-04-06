
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean; // New prop to make authentication optional
};

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && requireAuth) {
      navigate('/auth');
    }
  }, [user, loading, navigate, requireAuth]);

  if (loading && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow rendering children even without authentication if requireAuth is false
  return (requireAuth && !user) ? null : <>{children}</>;
};

export default ProtectedRoute;
