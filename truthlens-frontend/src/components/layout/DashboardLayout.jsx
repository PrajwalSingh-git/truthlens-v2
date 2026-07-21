import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ScanSearch, History, User } from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Analyze', icon: ScanSearch },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="glass-panel sticky top-24 flex flex-col gap-1 rounded-2xl p-3">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-white/5 hover:text-text'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
