import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Menu, X, LogOut, User, LayoutDashboard, History as HistoryIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@/components/ui/button'
import { SOCIAL_LINKS, GithubMark } from '@/lib/social'

// Main nav is intentionally the same whether signed in or not — Dashboard
// and History live in the profile menu instead, so the top nav doesn't
// reflow/jump when you log in.
const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/about', label: 'About' },
  { to: '/extension', label: 'Extension' },
  { to: '/creator', label: 'Creator' },
]

export default function Navbar() {
  const { isAuthenticated, signOut, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldCheck className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-lg font-bold tracking-tight">
            Truth<span className="text-primary">Lens</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-text"
          >
            <GithubMark className="h-4 w-4" />
            GitHub
          </a>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-card px-2 py-1.5 pr-3 transition-colors hover:border-primary/40"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="max-w-[120px] truncate text-sm text-text">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="glass-panel absolute right-0 mt-2 w-48 rounded-xl p-1.5 shadow-glow"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-white/5"
                    >
                      <HistoryIcon className="h-4 w-4" /> History
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-white/5"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <div className="my-1 h-px bg-white/5" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-text"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 border-t border-white/5 pt-3">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-text"
                >
                  <GithubMark className="h-4 w-4" /> View on GitHub
                </a>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-text"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-text"
                    >
                      <HistoryIcon className="h-4 w-4" /> History
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-text"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOpen(false)
                      navigate('/login')
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
