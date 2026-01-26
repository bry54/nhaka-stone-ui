import { AuthRouting } from '@/auth/auth-routing';
import { useAuth } from '@/auth/providers/auth-provider';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo2Layout } from '@/layouts/demo2/layout';
import { MemorialPortalPage } from '@/pages/public/memorial-portal';
import { PublicRouting } from '@/pages/public/public-routing';
import { DashboardPage } from '@/pages/store-admin';
import { MemorialsReviewPage, MyOrdersPage, StoreClientPage } from '@/pages/store-client';
import { Navigate, Route, Routes } from 'react-router';
import { UserRoles } from '@/types/contribution.types';


export function AppRoutingSetup() {
  const { user } = useAuth();

  // Determine what to show at "/" based on authentication and role
  // - Not logged in: Show landing page
  // - Admin: Redirect to /store-admin/home
  // - Client: Redirect to /store-client/home
  let rootElement = <PublicRouting />
  if (user?.role === UserRoles.ADMIN) {
    rootElement = <Navigate to="/store-admin/home" replace />
  } else if (user?.role === UserRoles.CLIENT) {
    rootElement = <Navigate to="/store-client/home" replace />
  }

  return (
    <Routes>
      {/* Root path - Landing page for unauthenticated, role-based redirect for authenticated */}
      <Route path="/" element={rootElement} />

      {/* Public memorial portal - accessible without authentication */}
      <Route path="/memorial-portal/:id" element={<MemorialPortalPage />} />

      {/* Protected routes - Require authentication */}
      <Route element={<RequireAuth />}>
        <Route element={<Demo2Layout />}>
          {/* Client routes */}
          <Route path="/store-client/home" element={<StoreClientPage />} />
          <Route path="/store-client/my-orders" element={<MyOrdersPage />} />
          <Route path="/store-client/order-receipt" element={<MyOrdersPage />} />
          <Route path="/store-client/memorial-reviews" element={<MemorialsReviewPage />} />

          {/* Admin routes */}
          <Route path="/store-admin/home" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* Auth and error routes */}
      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
