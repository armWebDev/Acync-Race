import { Navigate, Route, Routes } from 'react-router';
import Header from '../components/Header';
import { ROUTES } from '../constants';
import GaragePage from '../features/garage/GaragePage';
import WinnersPage from '../features/winners/WinnersPage';

export default function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path={ROUTES.garage} element={<GaragePage />} />
          <Route path={ROUTES.winners} element={<WinnersPage />} />
          <Route path="*" element={<Navigate to={ROUTES.garage} replace />} />
        </Routes>
      </main>
    </>
  );
}
