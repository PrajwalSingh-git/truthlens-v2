import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { scoreToTone } from '@/components/ui/meter'
import HighlightedText from './HighlightedText'
import MetricGaugeGrid from './MetricGaugeGrid'
import ShareabilityRisk from './ShareabilityRisk'
import ExtractedClaims from './ExtractedClaims'
import ExplanationEngine from './ExplanationEngine'
import PhraseIntelligence from './PhraseIntelligence'
import FactCheckLinks from './FactCheckLinks'
import ResponsibleAINote from './ResponsibleAINote'

// Charts pull in recharts (~100kb+) — lazy-load so pages that never open
// results (Home, Login, etc.) never pay for that chunk.
const ChartsBundle = lazy(() => import('./ChartsBundle'))

const toneLabel = {
  success: 'Likely credible',
  warning: 'Mixed signals',
  danger: 'Low credibility',
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-panel h-[300px] animate-pulse rounded-2xl" />
      ))}
    </div>
  )
}

export default function ResultsPanel({ result, onSave, saving }) {
  const tone = scoreToTone(result.credibility)

  function handleExportPdf() {
    document.body.classList.add('print-results-only')
    window.print()
    setTimeout(() => document.body.classList.remove('print-results-only'), 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      id="printable-results"
    >
      {/* Summary */}
      <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={tone === 'danger' ? 'destructive' : tone}>{toneLabel[tone]}</Badge>
            <Badge variant="default">Confidence {Math.round(result.confidence)}%</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{result.summary}</p>
        </div>
        <div className="flex shrink-0 gap-2 print:hidden">
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportPdf}>
            Export PDF
          </Button>
          <Button variant="secondary" size="sm" icon={Bookmark} onClick={onSave} loading={saving}>
            Save report
          </Button>
        </div>
      </Card>

      {/* 5-metric gauge grid */}
      <MetricGaugeGrid result={result} />

      {/* Shareability + Extracted claims */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ShareabilityRisk value={result.shareability_risk} />
        <ExtractedClaims claims={result.extracted_claims} />
      </div>

      {/* Explanation + highlighted text */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExplanationEngine explanations={result.explanations} guidance={result.verification_guidance} />
        <Card>
          <h3 className="mb-3 font-semibold text-text">Suspicious Phrase Highlighting</h3>
          <HighlightedText text={result.highlighted_text} flags={result.flags} />
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" /> High concern</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Worth noting</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Informational</span>
          </div>
        </Card>
      </div>

      {/* Phrase intelligence */}
      <PhraseIntelligence flags={result.flags} />

      {/* Fact-check links */}
      <div className="print:hidden">
        <FactCheckLinks query={result.title} />
      </div>

      {/* Charts (lazy-loaded) */}
      <Suspense fallback={<ChartsSkeleton />}>
        <ChartsBundle result={result} />
      </Suspense>

      <ResponsibleAINote />
    </motion.div>
  )
}
