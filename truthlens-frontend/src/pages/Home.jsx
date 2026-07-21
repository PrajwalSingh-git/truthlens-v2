import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ScanSearch, Target, Globe2, ShieldCheck,
  ArrowRight, Link2, Sparkles, Zap, Lock, Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import CountUp from '@/components/ui/count-up'
import LiveNewsFeed from '@/components/analysis/LiveNewsFeed'

const features = [
  { icon: Brain, title: 'Propaganda pattern analysis', desc: 'Scores, explains, and visualizes misinformation risk in a format people can understand quickly.' },
  { icon: Target, title: 'Suspicious phrase highlighting', desc: 'Scores, explains, and visualizes misinformation risk in a format people can understand quickly.' },
  { icon: Globe2, title: 'URL article extraction', desc: 'Scores, explains, and visualizes misinformation risk in a format people can understand quickly.' },
  { icon: ScanSearch, title: 'AI-generated verification guidance', desc: 'Scores, explains, and visualizes misinformation risk in a format people can understand quickly.' },
  { icon: Lock, title: 'Browser extension product concept', desc: 'Scores, explains, and visualizes misinformation risk in a format people can understand quickly.' },
  { icon: Zap, title: 'Failsafe fallback analyzer', desc: 'Scores, explains, and visualizes misinformation risk in a format people can understand quickly.' },
]

const steps = [
  { label: 'Paste', desc: 'Drop in a headline, article, URL, or social post.' },
  { label: 'Analyze', desc: 'TruthLens scans for bias, propaganda, and manipulation signals.' },
  { label: 'Understand', desc: 'Get a credibility score with the specific evidence behind it.' },
]

const stats = [
  { value: '12+', label: 'Credibility Signals' },
  { value: '100%', label: 'Explained, Not Just Scored' },
  { value: '<10s', label: 'Average Analysis Time' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[10%] top-40 h-[300px] w-[400px] rounded-full bg-secondary/10 blur-[100px]"
            animate={{ x: [0, -25, 15, 0], y: [0, 20, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Explainable credibility analysis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl md:text-6xl"
          >
            See what's actually
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              behind the headline.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted"
          >
            TruthLens reads content the way a trained fact-checker would — flagging bias, propaganda,
            and emotional manipulation, then explaining exactly why. No black-box "fake" or "real" labels.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/analyze">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Analyze content free
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="secondary">
                How it works
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Live-analysis style preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <Card className="relative overflow-hidden">
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-primary/10 via-primary/0 to-transparent"
              animate={{ top: ['-20%', '110%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            />
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Link2 className="h-4 w-4 text-muted" />
              <span className="truncate text-sm text-muted">
                "Scientists 'Stunned' As New Study Reveals Shocking Truth Everyone Missed…"
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Credibility', value: 34, tone: 'text-danger' },
                { label: 'Clickbait', value: 88, tone: 'text-warning' },
                { label: 'Bias', value: 61, tone: 'text-warning' },
                { label: 'Propaganda', value: 22, tone: 'text-success' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.04 }}
                  className="rounded-xl bg-card/60 p-3 text-center"
                >
                  <div className={`text-xl font-bold ${s.tone}`}>
                    <CountUp value={s.value} duration={1.4} />
                  </div>
                  <div className="mt-1 text-[11px] text-muted">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-surface/40 px-6 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="text-3xl font-bold text-primary sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Built to explain, not just judge</h2>
            <p className="mt-3 text-muted">
              Six signals work together to tell you not just what TruthLens thinks, but why.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <Card hover className="h-full">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  >
                    <f.icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="font-semibold text-text">{f.title}</h3>
                  <p className="mt-2 text-base text-muted">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live News Feed Demo */}
      <section className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-6xl"
        >
          <LiveNewsFeed />
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-surface/40 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Three steps. One clear answer.</h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-sm text-primary">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-text">{s.label}</h3>
                <p className="mt-2 text-base text-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glow-border mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-card to-surface p-10 text-center sm:p-16"
        >
          <ShieldCheck className="mx-auto mb-5 h-10 w-10 text-primary" />
          <h2 className="text-2xl font-bold sm:text-3xl">Stop guessing what's credible.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Run your first analysis in under ten seconds — no credit card, no signup required to try it.
          </p>
          <Link to="/analyze" className="mt-8 inline-block">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              Try TruthLens now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
