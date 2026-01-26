import { useAuth } from '@/auth/context/auth-context';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Navigate, Outlet } from 'react-router';

/**
 * Component to protect routes that require authentication.
 * Redirects unauthenticated users to the landing page.
 */
export const RequireAuth = () => {
  const { loading, user } = useAuth();

  // Show screen loader while checking auth status
  if (loading) {
    return <ScreenLoader />;
  }

  // Redirect to landing page if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Allow access to protected routes if authenticated
  return <Outlet />;
};
