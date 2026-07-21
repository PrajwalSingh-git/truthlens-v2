import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanSearch, History, Bookmark, TrendingUp, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CountUp from '@/components/ui/count-up'
import { scoreToTone } from '@/components/ui/meter'
import EmptyState from '@/components/ui/empty-state'
import { analysisApi } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function badgeVariant(score) {
  const t = scoreToTone(score)
  return t === 'danger' ? 'destructive' : t
}

export default function Dashboard() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [h, r] = await Promise.all([analysisApi.getHistory(), analysisApi.getReports()])
        setHistory(h || [])
        setReports(r || [])
      } catch {
        // Backend not reachable yet — dashboard just shows empty states.
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const avgCredibility = history.length
    ? Math.round(history.reduce((sum, h) => sum + (h.credibility ?? 0), 0) / history.length)
    : null

  const statCards = [
    { icon: ScanSearch, iconClass: 'bg-primary/10 text-primary', value: history.length, label: 'Total analyses' },
    { icon: Bookmark, iconClass: 'bg-secondary/10 text-secondary', value: reports.length, label: 'Saved reports' },
    { icon: TrendingUp, iconClass: 'bg-success/10 text-success', value: avgCredibility, label: 'Avg. credibility score' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}.</h1>
        <p className="mt-1 text-muted">Here's what's happening with your analyses.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <motion.div key={s.label} variants={itemVariants} whileHover={{ y: -3 }}>
            <Card hover className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconClass}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {s.value === null ? '—' : <CountUp value={s.value} duration={1} />}
                </div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick analyze */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h3 className="font-semibold text-text">Quick analyze</h3>
            <p className="mt-1 text-sm text-muted">Jump straight into evaluating a new piece of content.</p>
          </div>
          <Link to="/analyze">
            <Button icon={ArrowRight} iconPosition="right">Analyze now</Button>
          </Link>
        </Card>
      </motion.div>

      {/* Recent analyses */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-text">Recent analyses</h3>
            <Link to="/history" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <History className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-muted">Loading…</div>
          ) : history.length === 0 ? (
            <EmptyState
              icon={ScanSearch}
              title="No analyses yet"
              description="Run your first analysis and it'll show up here, ready to revisit anytime."
              action={
                <Link to="/analyze">
                  <Button size="sm" icon={ArrowRight} iconPosition="right">Analyze something</Button>
                </Link>
              }
            />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
              {history.slice(0, 5).map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-3 transition-colors hover:border-primary/20"
                >
                  <span className="truncate text-sm text-text">{item.title || item.input}</span>
                  <Badge variant={badgeVariant(item.credibility)}>{Math.round(item.credibility)}</Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
