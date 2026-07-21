import { motion } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import CountUp from '@/components/ui/count-up'

export default function ConfidenceCard({ confidence, politicalLean = 0 }) {
  const radius = 60
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (confidence / 100) * circumference

  // politicalLean: -100 (left) .. 0 (neutral) .. +100 (right) -> 0..100% position
  const spectrumPct = Math.max(0, Math.min(100, (politicalLean + 100) / 2))

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold text-text">AI Confidence Meter</h3>
        <BrainCircuit className="h-4 w-4 text-primary" />
      </div>
      <p className="mb-6 text-sm text-muted">Prediction reliability for this analysis</p>

      <div className="mx-auto my-2">
        <motion.div className="relative" style={{ width: 150, height: 150 }}>
          <svg width={150} height={150} className="-rotate-90">
            <circle cx={75} cy={75} r={radius} stroke="#112131" strokeWidth={strokeWidth} fill="none" />
            <motion.circle
              cx={75}
              cy={75}
              r={radius}
              stroke="#22D3EE"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.5))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-text">
              <CountUp value={confidence} decimals={0} duration={1.1} />
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted">Confidence</span>
          </div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold text-text">Bias Spectrum</h4>
        <div className="relative h-2 w-full overflow-visible rounded-full bg-gradient-to-r from-primary via-card to-danger">
          <motion.div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-bg bg-text shadow-glow"
            initial={{ left: '50%' }}
            animate={{ left: `${spectrumPct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ marginLeft: -8 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Left framing</span>
          <span>Ideologically loaded</span>
          <span>Right framing</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted/70">
          Estimate only, based on language patterns — not a factual judgment. Confidence is lower on
          short text.
        </p>
      </div>
    </Card>
  )
}
