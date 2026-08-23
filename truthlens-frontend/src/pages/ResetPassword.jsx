import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePassword } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()

  // Supabase's reset-password email link logs the browser into a
  // temporary session automatically — if that never happens (broken or
  // expired link), there's no valid session to update a password on.
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('This reset link is invalid or has expired. Please request a new one.')
      navigate('/forgot-password', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.")
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await updatePassword(password)
      toast.success('Password updated — you can now sign in with it.')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="mt-1 text-sm text-muted">Choose something you haven't used before.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type it again"
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" loading={loading} icon={ArrowRight} iconPosition="right">
              Update password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
