import { useAuth } from '@/auth/context/auth-context';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Outlet } from 'react-router';

/**
 * Component to protect routes that require authentication.
 * Redirects unauthenticated users to the landing page.
 */
export const RequireAuth = () => {
  const { loading } = useAuth();

  // Show screen loader while checking auth status
  if (loading) {
    return <ScreenLoader />;
  }

  // Allow access to protected routes if authenticated
  return <Outlet />;
};
