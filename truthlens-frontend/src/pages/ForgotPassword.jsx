import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestPasswordReset } from '@/services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      toast.error(err.message || 'Could not send reset email.')
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
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted">
            {sent ? "Check your inbox for a reset link." : "We'll email you a link to set a new one."}
          </p>
        </div>

        <Card>
          {sent ? (
            <div className="flex flex-col items-center py-4 text-center">
              <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
              <p className="text-sm text-text">
                If an account exists for <span className="font-medium">{email}</span>, a reset link is on
                its way. It can take a minute or two to arrive.
              </p>
              <Button variant="secondary" size="sm" className="mt-5" onClick={() => setSent(false)}>
                Send again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" loading={loading} icon={ArrowRight} iconPosition="right">
                Send reset link
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          Remembered it after all?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
