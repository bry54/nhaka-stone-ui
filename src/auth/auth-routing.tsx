import { Route, Routes } from 'react-router-dom';
import { BrandedLayout } from './layouts/branded';
import { SignInPage } from './pages/signin-page';
import { SignUpPage } from './pages/signup-page';
import { ResetPasswordPage } from './pages/reset-password-page';
import { ChangePasswordPage } from './pages/change-password-page';
import { CallbackPage } from './pages/callback-page';
import { TwoFactorAuth } from './pages/extended/tfa';
import { CheckEmail } from './pages/extended/check-email';

export function AuthRouting() {
  return (
    <Routes>
      <Route element={<BrandedLayout />}>
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="2fa" element={<TwoFactorAuth />} />
        <Route path="check-email" element={<CheckEmail />} />
      </Route>
      <Route path="callback" element={<CallbackPage />} />
    </Routes>
  );
}
