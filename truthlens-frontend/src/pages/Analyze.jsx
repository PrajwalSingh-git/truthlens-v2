import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Link2, ScanSearch, Wand2, User, GitCompareArrows } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AnalyzingState from '@/components/analysis/AnalyzingState'
import ResultsPanel from '@/components/analysis/ResultsPanel'
import ConfidenceCard from '@/components/analysis/ConfidenceCard'
import { analysisApi, describeApiError } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

const SAMPLES = [
  {
    label: 'Clickbait headline',
    tone: 'text-warning',
    text: "You WON'T BELIEVE What Scientists Just Discovered — Doctors Are STUNNED And Furious! Number 7 Will Shock You!!!",
  },
  {
    label: 'Propaganda-style post',
    tone: 'text-danger',
    text: "Wake up. The mainstream media won't tell you this, but real patriots already know the truth. The radical elites and their agenda are obviously destroying everything — everyone knows it, it's undeniable.",
  },
  {
    label: 'Well-sourced report',
    tone: 'text-success',
    text: "According to a new study published in Nature, researchers found that global average temperatures rose by 1.1°C over the past century. Reportedly, the data was collected from over 30,000 weather stations, and the findings are consistent with earlier climate models, scientists say.",
  },
  {
    label: 'Emotional appeal',
    tone: 'text-warning',
    text: "This is absolutely heartbreaking and outrageous. Families are devastated and furious after this tragic, horrifying decision — how could anyone let this happen?! Share this before it's too late!",
  },
]

const DEMO_SAMPLE = "Shocking truth revealed: secret documents prove the media is hiding this crisis from you. You won't believe what officials are refusing to admit, and doctors hate this evidence because it exposes their agenda."

export default function Analyze() {
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [wakingUp, setWakingUp] = useState(false)
  const { isAuthenticated } = useAuth()

  function loadSample(sample) {
    setMode('text')
    setText(sample.text)
    setResult(null)
    toast.success(`Loaded "${sample.label}" — hit Run analysis.`)
  }

  function loadDemo() {
    setMode('text')
    setText(DEMO_SAMPLE)
    setResult(null)
  }

  async function handleAnalyze() {
    const input = mode === 'text' ? text : url
    if (!input.trim()) {
      toast.error(mode === 'text' ? 'Paste some content first.' : 'Enter a URL first.')
      return
    }

    setLoading(true)
    setResult(null)
    setWakingUp(false)
    const opts = { onRetry: () => setWakingUp(true) }
    try {
      const data =
        mode === 'text' ? await analysisApi.analyzeText(input, opts) : await analysisApi.analyzeUrl(input, opts)
      setResult(data)
    } catch (err) {
      if (err.isRateLimited) {
        toast.error(err.message, { duration: 6000 })
      } else {
        toast.error(err.message || 'Analysis failed. Is the backend running?')
      }
    } finally {
      setLoading(false)
      setWakingUp(false)
    }
  }

  async function handleSave() {
    if (!isAuthenticated) {
      toast.error('Sign in to save reports.')
      return
    }
    setSaving(true)
    try {
      await analysisApi.saveReport(result.id, result.title || 'Untitled analysis')
      toast.success('Report saved to your dashboard.')
    } catch (err) {
      toast.error(describeApiError(err, 'Could not save report.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Analysis Dashboard
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Analyze Content Credibility</h1>
          <p className="mt-2 max-w-xl text-muted">
            Paste a headline, article, social post, or URL. TruthLens AI scores credibility and explains
            the manipulation signals it detects.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link to="/compare">
            <Button variant="secondary" icon={GitCompareArrows}>Compare</Button>
          </Link>
          {isAuthenticated && (
            <Link to="/profile">
              <Button variant="secondary" icon={User}>Profile</Button>
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="glow-border h-full">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList>
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4" /> Text / Post
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Link2 className="h-4 w-4" /> URL Analyzer
                </TabsTrigger>
              </TabsList>

              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="text">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    placeholder="Paste an article, headline, or social post…"
                  />
                </TabsContent>
                <TabsContent value="url">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                  />
                </TabsContent>
              </motion.div>
            </Tabs>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAnalyze}
                loading={loading}
                disabled={loading}
                icon={ScanSearch}
                className="flex-1"
                size="lg"
              >
                {loading ? 'Analyzing…' : 'Analyze Content'}
              </Button>
              <Button onClick={loadDemo} variant="secondary" size="lg">
                Load Demo
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-white/5 pt-5">
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <Wand2 className="h-3.5 w-3.5" /> Try a sample:
              </span>
              {SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  onClick={() => loadSample(sample)}
                  className="rounded-full border border-white/10 bg-card/60 px-3.5 py-1.5 text-sm font-medium text-muted transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-text"
                >
                  <span className={sample.tone}>●</span> {sample.label}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <ConfidenceCard confidence={result?.confidence ?? 0} politicalLean={result?.political_lean ?? 0} hasResult={!!result} />
        </motion.div>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <AnalyzingState wakingUp={wakingUp} />
            </motion.div>
          )}
          {!loading && result && (
            <ResultsPanel key="result" result={result} onSave={handleSave} saving={saving} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
