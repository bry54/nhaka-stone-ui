import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './landing';

export function PublicRouting() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
    </Routes>
  )
}
