import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminProtectedRoute from './routes/AdminProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'

import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Compare from './pages/Compare'
import About from './pages/About'
import Extension from './pages/Extension'
import Creator from './pages/Creator'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import HistoryPage from './pages/HistoryPage'
import SavedReports from './pages/SavedReports'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Lazy-loaded: the admin panel is never touched by ~99% of visitors, so
// there's no reason to ship its code (and its own table/dialog/chart
// usage) in the main bundle everyone downloads on first visit.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-card border-t-primary" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#FAFAFA',
              border: '1px solid rgba(148,163,184,0.15)',
            },
          }}
        />
        <Routes>
          {/* Admin panel — deliberately outside the main Layout (no
              navbar/footer, no links to it anywhere on the public site),
              and lazy-loaded so its code never ships to regular visitors.
              Its own separate password-based auth, unrelated to Supabase
              user accounts. */}
          <Route
            path="creator-admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="creator-admin"
            element={
              <AdminProtectedRoute>
                <Suspense fallback={<AdminFallback />}>
                  <AdminDashboard />
                </Suspense>
              </AdminProtectedRoute>
            }
          />

          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="compare" element={<Compare />} />
            <Route path="about" element={<About />} />
            <Route path="extension" element={<Extension />} />
            <Route path="creator" element={<Creator />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="reports" element={<SavedReports />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
