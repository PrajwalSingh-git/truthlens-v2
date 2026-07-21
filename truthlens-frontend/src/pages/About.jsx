import { motion } from 'framer-motion'
import { Brain, Flame, AlertTriangle, Quote } from 'lucide-react'
import { Card } from '@/components/ui/card'

const signals = [
  { icon: Brain, title: 'Bias', desc: 'Measures how one-sided the framing is relative to the underlying facts.' },
  { icon: Flame, title: 'Propaganda', desc: 'Detects loaded language, false urgency, and manufactured consensus patterns.' },
  { icon: AlertTriangle, title: 'Clickbait', desc: 'Compares headline claims against what the body actually supports.' },
  { icon: Quote, title: 'Emotional manipulation', desc: 'Flags language designed to provoke reaction over reflection.' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl font-bold">Credibility, explained.</h1>
        <p className="mt-4 text-muted">
          TruthLens doesn't tell you what to believe. It shows you the specific signals in a piece of
          content — the ones a trained fact-checker would notice — so you can make the call yourself.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {signals.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card hover className="h-full">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-base text-muted">{s.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
        <Card>
          <h3 className="font-semibold text-text">Why explainability matters</h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            A single "fake" or "real" label asks you to trust a black box. TruthLens instead breaks
            credibility into signals you can independently verify — so the score is a starting point for
            your own thinking, not a replacement for it.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
