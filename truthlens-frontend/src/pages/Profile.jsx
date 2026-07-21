import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Mail, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/context/AuthContext'

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const fullName = user?.user_metadata?.full_name || 'TruthLens User'
  const avatarUrl = user?.user_metadata?.avatar_url
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  async function handleSignOut() {
    await signOut()
    navigate('/')
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
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button variant="destructive" icon={LogOut} className="w-full" onClick={handleSignOut}>
          Logout
        </Button>
      </motion.div>
    </motion.div>
  )
}
