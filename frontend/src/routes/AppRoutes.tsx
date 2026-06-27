import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loading } from '../components/feedback/Loading'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

const DashboardPage = lazy(() => import('../pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const EditSubscriberPage = lazy(() => import('../pages/EditSubscriberPage').then((module) => ({ default: module.EditSubscriberPage })))
const HelpCenterPage = lazy(() => import('../pages/HelpCenterPage').then((module) => ({ default: module.HelpCenterPage })))
const PaymentsPage = lazy(() => import('../pages/PaymentsPage').then((module) => ({ default: module.PaymentsPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const ReportsPage = lazy(() => import('../pages/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const SubscriberDetailPage = lazy(() => import('../pages/SubscriberDetailPage').then((module) => ({ default: module.SubscriberDetailPage })))
const SubscribersPage = lazy(() => import('../pages/SubscribersPage').then((module) => ({ default: module.SubscribersPage })))
const SupportPage = lazy(() => import('../pages/SupportPage').then((module) => ({ default: module.SupportPage })))

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/subscribers" element={<ProtectedRoute><SubscribersPage /></ProtectedRoute>} />
          <Route path="/subscribers/new" element={<ProtectedRoute><EditSubscriberPage /></ProtectedRoute>} />
          <Route path="/subscribers/:id" element={<ProtectedRoute><SubscriberDetailPage /></ProtectedRoute>} />
          <Route path="/subscribers/:id/edit" element={<ProtectedRoute><EditSubscriberPage /></ProtectedRoute>} />
          <Route path="/edit-subscriber" element={<Navigate to="/subscribers/TT-9012/edit" replace />} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/renewals" element={<Navigate to="/payments" replace />} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpCenterPage /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
