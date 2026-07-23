import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { Brain, Flame, AlertTriangle, Quote, Radar, X, Check, ArrowDown, Landmark } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StatsStrip from '@/components/common/StatsStrip'

const signals = [
  {
    icon: Brain, title: 'Bias', desc: 'Measures how one-sided the framing is relative to the underlying facts.',
    example: null,
  },
  {
    icon: Flame, title: 'Propaganda', desc: 'Detects loaded language, false urgency, and manufactured consensus patterns.',
    example: null,
  },
  {
    icon: AlertTriangle, title: 'Clickbait', desc: 'Compares headline claims against what the body actually supports.',
    example: {
      quote: '"Doctors HATE this one trick!"',
      detected: ['Sensational wording', 'Unsupported claim', 'Curiosity gap'],
    },
  },
  {
    icon: Quote, title: 'Emotional manipulation', desc: 'Flags language designed to provoke reaction over reflection.',
    example: {
      quote: '"This shocking betrayal should make every citizen furious."',
      detected: ['Loaded language', 'Emotional trigger', 'Polarizing tone'],
    },
  },
  {
    icon: Landmark, title: 'Source reliability', desc: 'Evaluates domain reputation, author transparency, and citation quality.',
    example: null,
  },
]

const PIPELINE = ['Content', 'Language Analysis', 'Signal Detection', 'Credibility Score', 'Explanation']

const STATS = [
  { value: 12, suffix: '+', label: 'Detection signals' },
  { value: 5, label: 'Analysis modules' },
  { value: '<5s', isNumeric: false, label: 'Average analysis time' },
  { value: 100, suffix: '%', label: 'Explainable results' },
]

const COMPARISON = [
  { trad: 'Fake', lens: 'Credibility: 38/100' },
  { trad: 'No explanation', lens: 'Shows propaganda, bias, clickbait' },
  { trad: 'Black box', lens: 'Transparent reasoning' },
]

export default function About() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 pb-16 pt-16">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute right-[5%] top-10 h-64 w-64 rounded-full border border-primary/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[8%] top-16 h-44 w-44 rounded-full border border-primary/15"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Understand why content deserves your trust.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              TruthLens doesn't simply label content as "fake" or "real." It analyzes multiple credibility
              signals and explains the reasoning behind every score.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.15 }}
            className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-primary/20 bg-primary/5"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Radar className="h-14 w-14 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-surface/40 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <StatsStrip stats={STATS} />
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">How the analysis works</h2>
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-2">
            {PIPELINE.map((step, i) => (
              <motion.div key={step} className="flex items-center gap-1 sm:contents">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-center text-sm font-medium text-primary"
                >
                  {step}
                </motion.div>
                {i < PIPELINE.length - 1 && (
                  <ArrowDown className="h-4 w-4 shrink-0 rotate-0 text-muted/50 sm:-rotate-90" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signal cards */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {signals.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <Card hover className="h-full">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  >
                    <s.icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="font-semibold text-text">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.desc}</p>

                  {s.example && (
                    <div className="mt-4 rounded-lg border border-white/5 bg-card/50 p-3">
                      <p className="text-xs italic text-muted">{s.example.quote}</p>
                      <div className="mt-2 space-y-1">
                        {s.example.detected.map((d) => (
                          <div key={d} className="flex items-center gap-1.5 text-xs text-text">
                            <Check className="h-3 w-3 text-success" /> {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-text">Why explainability matters</h2>
          <Card>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center font-semibold text-muted">Traditional AI</div>
              <div className="text-center font-semibold text-primary">TruthLens</div>
              {COMPARISON.map((row, i) => (
                <Fragment key={row.trad}>
                  <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 text-muted">
                    <X className="h-3.5 w-3.5 shrink-0 text-danger" /> {row.trad}
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 text-text">
                    <Check className="h-3.5 w-3.5 shrink-0 text-success" /> {row.lens}
                  </div>
                </Fragment>
              ))}
            </div>
          </Card>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted">
            A single "fake" or "real" label asks you to trust a black box. TruthLens instead breaks
            credibility into signals you can independently verify — so the score is a starting point for
            your own thinking, not a replacement for it.
          </p>
        </div>
      </section>
    </div>
  )
}
