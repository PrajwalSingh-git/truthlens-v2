import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'

import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Compare from './pages/Compare'
import About from './pages/About'
import Extension from './pages/Extension'
import Creator from './pages/Creator'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import HistoryPage from './pages/HistoryPage'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/truthlens-v2">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#112131',
              color: '#F8FAFC',
              border: '1px solid rgba(148,163,184,0.15)',
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="compare" element={<Compare />} />
            <Route path="about" element={<About />} />
            <Route path="extension" element={<Extension />} />
            <Route path="creator" element={<Creator />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
