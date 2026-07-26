const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const ADMIN_TOKEN_KEY = 'tl_admin_token'
const IMPERSONATION_KEY = 'tl_impersonation'

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function getImpersonation() {
  const raw = sessionStorage.getItem(IMPERSONATION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setImpersonation(token, email, userId) {
  sessionStorage.setItem(IMPERSONATION_KEY, JSON.stringify({ token, email, userId }))
}

export function clearImpersonation() {
  sessionStorage.removeItem(IMPERSONATION_KEY)
}

async function adminRequest(path, options = {}) {
  const token = getAdminToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    clearAdminToken()
    throw new Error('Admin session expired — please log in again.')
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      message = body.detail || message
    } catch { /* ignore */ }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

export const adminApi = {
  login: async (password) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.detail || 'Login failed.')
    }
    const data = await res.json()
    setAdminToken(data.token)
    return data
  },

  getStats: () => adminRequest('/api/admin/stats'),

  getUsers: () => adminRequest('/api/admin/users'),

  deleteUser: (userId) => adminRequest(`/api/admin/users/${userId}`, { method: 'DELETE' }),

  impersonate: async (userId) => {
    const data = await adminRequest(`/api/admin/users/${userId}/impersonate`, { method: 'POST' })
    setImpersonation(data.token, data.email, data.user_id)
    return data
  },
}
