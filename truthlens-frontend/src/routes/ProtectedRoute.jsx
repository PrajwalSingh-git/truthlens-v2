import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getImpersonation } from '../services/adminApi'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // An admin viewing "as" a user (via the admin panel's impersonate
  // button) has a valid impersonation token but no real Supabase
  // session — treat that as authenticated too.
  const isImpersonating = !!getImpersonation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-card border-t-primary" />
      </div>
    )
  }

  if (!isAuthenticated && !isImpersonating) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
