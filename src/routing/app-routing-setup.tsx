import { AuthRouting } from '@/auth/auth-routing';
import { useAuth } from '@/auth/providers/auth-provider';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo2Layout } from '@/layouts/demo2/layout';
import { DashboardPage } from '@/pages/store-admin';

import {
  MyOrdersPage,
  StoreClientPage,
} from '@/pages/store-client';
import { PublicRouting } from '@/pages/public/public-routing';
import { Navigate, Route, Routes } from 'react-router';
import { MemorialPortalPage } from '@/pages/public/memorial-portal';

export function AppRoutingSetup() {
  const { user } = useAuth();

  let element = <PublicRouting />
  if (user?.role === 'admin') {
    element = <Navigate to="/store-admin/home" replace />
  } else if (user?.role === 'user') {
    element = <Navigate to="/store-client/home" replace />
  }

  return (
    <Routes>
      <Route path="/" element={element} />
      <Route path="/memorial-portal/:id" element={<MemorialPortalPage />} />

      {/* Protected routes - Require authentication */}
      <Route element={<RequireAuth />}>
        <Route element={<Demo2Layout />}>
          {/* Authenticated users accessing root are redirected to home */}
          <Route path="/store-client/home" element={<StoreClientPage />} />
          <Route path="/store-client/my-orders" element={<MyOrdersPage />} />

          <Route path="/store-admin/home" element={<DashboardPage />} />
        </Route>
      </Route>


      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
