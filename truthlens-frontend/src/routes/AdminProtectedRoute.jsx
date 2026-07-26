import { Navigate } from 'react-router-dom'
import { getAdminToken } from '@/services/adminApi'

export default function AdminProtectedRoute({ children }) {
  if (!getAdminToken()) {
    return <Navigate to="/creator-admin/login" replace />
  }
  return children
}
