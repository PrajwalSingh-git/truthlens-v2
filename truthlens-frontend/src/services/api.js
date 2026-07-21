import { supabase } from './supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// A custom error type so callers (and the UI) can distinguish "server is
// cold-starting / unreachable" from a normal 4xx/5xx API error, and show
// an appropriate message instead of a generic failure toast.
export class ApiError extends Error {
  constructor(message, { status, isNetworkError = false, isRateLimited = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isNetworkError = isNetworkError
    this.isRateLimited = isRateLimited
  }
}

async function authHeader() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch wrapper with a couple of automatic retries on network failure or
 * a 502/503 — this is what you hit when a free-tier backend (e.g. Render)
 * is cold-starting after inactivity. Each retry waits a bit longer.
 * onRetry(attempt) is called before each retry so the UI can show a
 * "waking up the server…" message.
 */
async function request(path, options = {}, { retries = 2, onRetry } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
    ...options.headers,
  }

  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

      if (res.status === 429) {
        let message = 'Rate limit reached — please wait a bit before trying again.'
        try {
          const body = await res.json()
          message = body.detail || message
        } catch { /* ignore parse failure */ }
        throw new ApiError(message, { status: 429, isRateLimited: true })
      }

      if ((res.status === 502 || res.status === 503) && attempt < retries) {
        onRetry?.(attempt + 1)
        await sleep(1500 * (attempt + 1))
        continue
      }

      if (!res.ok) {
        let message = `Request failed with status ${res.status}`
        try {
          const body = await res.json()
          message = body.detail || message
        } catch { /* ignore parse failure */ }
        throw new ApiError(message, { status: res.status })
      }

      if (res.status === 204) return null
      return await res.json()
    } catch (err) {
      if (err instanceof ApiError) throw err

      // A thrown TypeError from fetch() means the network request itself
      // failed (server unreachable, cold start, CORS, offline, etc.)
      lastError = err
      if (attempt < retries) {
        onRetry?.(attempt + 1)
        await sleep(1500 * (attempt + 1))
        continue
      }
    }
  }

  const isLocalBackend = /localhost|127\.0\.0\.1/.test(API_BASE_URL)
  const message = isLocalBackend
    ? `Couldn't reach the backend at ${API_BASE_URL}. Make sure it's running (uvicorn app.main:app --reload --port 8000) and check your browser console for CORS errors.`
    : "Couldn't reach the TruthLens server. If it's hosted on a free tier, it may be waking up from sleep — please try again in a few seconds."

  throw new ApiError(message, { isNetworkError: true })
}

/**
 * Turns any error from the API layer into an accurate, actionable message
 * for the UI — distinguishing "you need to sign in again" (401) from
 * "the server is unreachable" (network/cold-start) from everything else,
 * instead of a single generic "could not reach the backend" message that
 * misleads people when the real issue is an auth/session problem.
 */
export function describeApiError(err, fallback = 'Something went wrong.') {
  if (!(err instanceof ApiError)) return err?.message || fallback
  if (err.status === 401) return 'Your session has expired — please sign in again.'
  if (err.isRateLimited) return err.message
  if (err.isNetworkError) return err.message
  return err.message || fallback
}

export const analysisApi = {
  analyzeText: (text, opts) =>
    request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ input_type: 'text', input: text }),
    }, opts),

  analyzeUrl: (url, opts) =>
    request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ input_type: 'url', input: url }),
    }, opts),

  getHistory: () => request('/api/history'),

  getAnalysis: (id) => request(`/api/history/${id}`),

  deleteAnalysis: (id) => request(`/api/history/${id}`, { method: 'DELETE' }),

  saveReport: (analysisId, title) =>
    request('/api/reports', {
      method: 'POST',
      body: JSON.stringify({ analysis_id: analysisId, title }),
    }),

  getReports: () => request('/api/reports'),
}
