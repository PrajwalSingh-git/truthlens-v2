import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GitCompareArrows, ScanSearch, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import CountUp from '@/components/ui/count-up'
import { scoreToTone } from '@/components/ui/meter'
import { analysisApi } from '@/services/api'

const METRICS = [
  { key: 'credibility', label: 'Credibility', higherIsBetter: true, fromRoot: true },
  { key: 'clickbait', label: 'Clickbait', higherIsBetter: false },
  { key: 'propaganda', label: 'Propaganda', higherIsBetter: false },
  { key: 'emotional_manipulation', label: 'Emotional Manipulation', higherIsBetter: false },
  { key: 'political_bias', label: 'Political Bias', higherIsBetter: false },
]

function getValue(result, metric) {
  return metric.fromRoot ? result[metric.key] : result.signals[metric.key]
}

const toneColors = { success: '#22C55E', warning: '#F59E0B', danger: '#EF4444' }

function MetricRow({ metric, a, b }) {
  const valA = getValue(a, metric)
  const valB = getValue(b, metric)
  const diff = valA - valB

  const winner = Math.abs(diff) < 3 ? 'tie' : (diff > 0) === metric.higherIsBetter ? 'a' : 'b'
  const toneA = metric.higherIsBetter ? scoreToTone(valA) : scoreToTone(100 - valA)
  const toneB = metric.higherIsBetter ? scoreToTone(valB) : scoreToTone(100 - valB)

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
      <div className="text-right">
        <div className="flex items-center justify-end gap-2">
          {winner === 'a' && <TrendingUp className="h-3.5 w-3.5 text-success" />}
          <span className="text-xl font-bold" style={{ color: toneColors[toneA] }}>
            <CountUp value={valA} decimals={0} duration={0.8} />
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-card">
          <motion.div
            className="ml-auto h-full rounded-full"
            style={{ backgroundColor: toneColors[toneA] }}
            initial={{ width: 0 }}
            animate={{ width: `${valA}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="w-32 shrink-0 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        {metric.label}
      </div>

      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold" style={{ color: toneColors[toneB] }}>
            <CountUp value={valB} decimals={0} duration={0.8} />
          </span>
          {winner === 'b' && <TrendingDown className="h-3.5 w-3.5 rotate-180 text-success" />}
          {winner === 'tie' && <Minus className="h-3.5 w-3.5 text-muted" />}
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-card">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: toneColors[toneB] }}
            initial={{ width: 0 }}
            animate={{ width: `${valB}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Compare() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  async function handleCompare() {
    if (!textA.trim() || !textB.trim()) {
      toast.error('Paste content into both sides to compare.')
      return
    }
    setLoading(true)
    setResults(null)
    try {
      const [a, b] = await Promise.all([
        analysisApi.analyzeText(textA),
        analysisApi.analyzeText(textB),
      ])
      setResults({ a, b })
    } catch (err) {
      toast.error(err.message || 'Comparison failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/analyze" className="mb-3 flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Analyze
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GitCompareArrows className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Compare Content</h1>
            <p className="mt-1 text-muted">See how two pieces of content stack up, signal by signal.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-primary">Content A</h3>
          <Textarea rows={7} value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="Paste the first piece of content…" />
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-secondary">Content B</h3>
          <Textarea rows={7} value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="Paste the second piece of content…" />
        </Card>
      </div>

      <Button onClick={handleCompare} loading={loading} icon={ScanSearch} size="lg" className="mt-5 w-full">
        {loading ? 'Comparing…' : 'Compare'}
      </Button>

      {results && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <Card>
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-primary">Content A</span>
              <span className="text-secondary">Content B</span>
            </div>
            <div className="divide-y divide-white/5">
              {METRICS.map((m) => (
                <MetricRow key={m.key} metric={m} a={results.a} b={results.b} />
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
