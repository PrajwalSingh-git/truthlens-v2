import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentSession, onAuthStateChange, signOut as authSignOut } from '../services/authService'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription

    async function init() {
      try {
        const current = await getCurrentSession()
        setSession(current)
      } catch (err) {
        console.error('[TruthLens] Failed to restore session:', err.message)
      } finally {
        setLoading(false)
      }

      subscription = onAuthStateChange((newSession) => {
        setSession(newSession)
      })
    }

    init()
    return () => subscription?.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    loading,
    signOut: async () => {
      await authSignOut()
      setSession(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
