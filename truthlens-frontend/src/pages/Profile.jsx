import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Mail, Calendar, ScanSearch, Bookmark, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CountUp from '@/components/ui/count-up'
import { useAuth } from '@/context/AuthContext'
import { analysisApi, accountApi, describeApiError } from '@/services/api'

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ analyses: null, reports: null })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const fullName = user?.user_metadata?.full_name || 'TruthLens User'
  const avatarUrl = user?.user_metadata?.avatar_url
  const provider = user?.app_metadata?.provider || 'email'
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  useEffect(() => {
    async function load() {
      try {
        const [history, reports] = await Promise.all([analysisApi.getHistory(), analysisApi.getReports()])
        setStats({ analyses: history?.length ?? 0, reports: reports?.length ?? 0 })
      } catch {
        // Non-critical — profile still renders fine without these.
      }
    }
    load()
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await accountApi.deleteAccount()
      toast.success('Your account has been deleted.')
      await signOut()
      navigate('/')
    } catch (err) {
      toast.error(describeApiError(err, 'Could not delete your account. Try again later.'))
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="mx-auto max-w-xl space-y-6"
    >
      <motion.h1 variants={itemVariants} className="text-2xl font-bold">Profile</motion.h1>

      <motion.div variants={itemVariants}>
        <Card className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
          </motion.div>
          <h2 className="mt-4 text-lg font-semibold">{fullName}</h2>
          <p className="text-sm text-muted">{user?.email}</p>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ScanSearch className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xl font-bold">
              {stats.analyses === null ? '—' : <CountUp value={stats.analyses} duration={0.8} />}
            </div>
            <div className="text-xs text-muted">Analyses run</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Bookmark className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xl font-bold">
              {stats.reports === null ? '—' : <CountUp value={stats.reports} duration={0.8} />}
            </div>
            <div className="text-xs text-muted">Reports saved</div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-muted">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-muted">Email</div>
              <div className="text-sm text-text">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-muted">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-muted">Joined</div>
              <div className="text-sm text-text">{joinDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-muted">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-muted">Signed in with</div>
              <div className="text-sm capitalize text-text">{provider}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button variant="destructive" icon={LogOut} className="w-full" onClick={handleSignOut}>
          Logout
        </Button>
      </motion.div>

      {/* Danger zone */}
      <motion.div variants={itemVariants}>
        <Card className="border-danger/20">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text">Danger zone</h3>
              <p className="mt-1 text-sm text-muted">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              <Button
                variant="destructive"
                size="sm"
                icon={Trash2}
                className="mt-4"
                onClick={() => setDeleteOpen(true)}
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setConfirmText('') }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This permanently removes your account, analysis history, and saved reports. This action
              cannot be undone. Type <span className="font-semibold text-text">DELETE</span> to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="mt-2"
          />
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              icon={Trash2}
              loading={deleting}
              disabled={confirmText !== 'DELETE'}
              onClick={handleDeleteAccount}
            >
              Permanently Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
