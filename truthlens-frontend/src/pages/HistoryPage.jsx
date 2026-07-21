import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Eye, Search, History, SearchX, ScanSearch } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { scoreToTone } from '@/components/ui/meter'
import EmptyState from '@/components/ui/empty-state'
import ResultsPanel from '@/components/analysis/ResultsPanel'
import { analysisApi, describeApiError } from '@/services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function badgeVariant(score) {
  const t = scoreToTone(score)
  return t === 'danger' ? 'destructive' : t
}

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [openItem, setOpenItem] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const h = await analysisApi.getHistory()
      setHistory(h || [])
    } catch (err) {
      toast.error(describeApiError(err, 'Could not load your history.'), { id: 'history-load-error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const prev = history
    setHistory((h) => h.filter((i) => i.id !== id))
    try {
      await analysisApi.deleteAnalysis(id)
      toast.success('Analysis deleted.')
    } catch (err) {
      setHistory(prev)
      toast.error(describeApiError(err, 'Could not delete.'))
    }
  }

  async function handleReopen(id) {
    try {
      const full = await analysisApi.getAnalysis(id)
      setOpenItem(full)
      setDialogOpen(true)
    } catch (err) {
      toast.error(describeApiError(err, 'Could not load analysis.'))
    }
  }

  const filtered = history.filter((h) =>
    (h.title || h.input || '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="mt-1 text-muted">Every analysis you've run, in one timeline.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your history…"
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted">Loading…</div>
          ) : filtered.length === 0 ? (
            history.length === 0 ? (
              <EmptyState
                icon={History}
                title="No analyses yet"
                description="Your analysis history will appear here once you run your first check."
                action={
                  <Link to="/analyze">
                    <Button size="sm" icon={ScanSearch}>Analyze something</Button>
                  </Link>
                }
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title="No results match your search"
                description="Try a different keyword, or clear the search to see everything."
              />
            )
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-white/5">
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{item.title || item.input}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant={badgeVariant(item.credibility)}>{Math.round(item.credibility)}</Badge>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => handleReopen(item.id)}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-primary"
                      title="Reopen" aria-label="Reopen this analysis"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      title="Delete" aria-label="Delete this analysis"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {openItem && (
            <>
              <DialogHeader>
                <DialogTitle>{openItem.title || 'Analysis'}</DialogTitle>
              </DialogHeader>
              <ResultsPanel result={openItem} onSave={() => {}} saving={false} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
