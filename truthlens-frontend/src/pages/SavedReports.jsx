import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, Eye, ScanSearch } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import EmptyState from '@/components/ui/empty-state'
import ResultsPanel from '@/components/analysis/ResultsPanel'
import { analysisApi, describeApiError } from '@/services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function SavedReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [openItem, setOpenItem] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const r = await analysisApi.getReports()
      setReports(r || [])
    } catch (err) {
      toast.error(describeApiError(err, 'Could not load your saved reports.'), { id: 'reports-load-error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleOpen(report) {
    try {
      const full = await analysisApi.getAnalysis(report.analysis_id)
      setOpenItem(full)
      setDialogOpen(true)
    } catch (err) {
      toast.error(describeApiError(err, 'Could not load this report.'))
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Saved Reports</h1>
        <p className="mt-1 text-muted">Analyses you've explicitly saved for later.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted">Loading…</div>
          ) : reports.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved reports yet"
              description='Run an analysis and hit "Save report" to keep it here for later.'
              action={
                <Link to="/analyze">
                  <Button size="sm" icon={ScanSearch}>Analyze something</Button>
                </Link>
              }
            />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-white/5">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  variants={itemVariants}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{report.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Saved {new Date(report.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpen(report)}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
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
                <DialogTitle>{openItem.title || 'Report'}</DialogTitle>
              </DialogHeader>
              <ResultsPanel result={openItem} onSave={() => {}} saving={false} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
