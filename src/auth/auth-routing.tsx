import { Navigate, Route, Routes } from 'react-router';

/**
 * Handles all authentication related routes.
 * This component is mounted at /auth/* in the main application router.
 * Since we've simplified the auth system, we redirect all auth routes to the main dashboard.
 */
export function AuthRouting() {
  return (
    <Routes>
      {/* Index route to redirect to dashboard */}
      <Route index element={<Navigate to="/" replace />} />

      {/* Catch all auth routes and redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
