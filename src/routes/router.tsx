import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import Layout from '../components/layout/Layout';

const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AssistantPage = lazy(() => import('../pages/AssistantPage'));
const ContactsPage = lazy(() => import('../pages/ContactsPage'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const MedicalProfilePage = lazy(() => import('../pages/MedicalProfilePage'));
const QRCardPage = lazy(() => import('../pages/QRCardPage'));
const OfflineGuidesPage = lazy(() => import('../pages/OfflineGuidesPage'));
const PhotoReportPage = lazy(() => import('../pages/PhotoReportPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/assistant', element: <AssistantPage /> },
      { path: '/contacts', element: <ContactsPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/profile', element: <MedicalProfilePage /> },
      { path: '/qr-card', element: <QRCardPage /> },
      { path: '/guides', element: <OfflineGuidesPage /> },
      { path: '/report', element: <PhotoReportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
