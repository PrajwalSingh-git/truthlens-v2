import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CircleCheck, Bell, Wand2, ShieldAlert, Globe, X, Check,
  ArrowDown, Star, ScanEye,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CountUp from '@/components/ui/count-up'
import { SOCIAL_LINKS } from '@/lib/social'

const CHECKLIST = ['Inline credibility badge', 'Suspicious phrase overlay', 'One-click verification checklist']

const SUPPORTED_SITES = ['BBC', 'CNN', 'Reuters', 'X (Twitter)', 'Reddit', 'Facebook', 'YouTube']

const HOW_IT_WORKS = [
  { label: 'Open article', desc: 'Browse any news page or social post as usual.' },
  { label: 'TruthLens scans the page', desc: 'The extension reads the visible article text automatically.' },
  { label: 'AI detects manipulation', desc: 'Signals like clickbait, bias, and propaganda get scored in seconds.' },
  { label: 'Credibility badge appears', desc: 'A small inline badge shows the score without leaving the page.' },
  { label: 'Open detailed explanation', desc: 'Click through for the full phrase-by-phrase breakdown.' },
]

const FUTURE_FEATURES = [
  { icon: ShieldAlert, title: 'Social Media Overlay', desc: 'Shows credibility directly inside X, Facebook, Reddit, and LinkedIn feeds — no need to open a separate tab.' },
  { icon: Globe, title: 'Automatic Page Analysis', desc: 'Every article is scanned in the background while you browse, with results cached for instant re-visits.' },
  { icon: Bell, title: 'Smart Share Warning', desc: 'Warns you before reposting content that scores high on manipulation risk, with a one-tap "see why" link.' },
]

const COMPARISON = {
  without: ['Click first', 'Verify later', 'Easy to miss bias'],
  with: ['Warning before reading', 'Explainable AI', 'Credibility score', 'Suspicious phrases highlighted'],
}

const VERSIONS = [
  { version: 'v1', target: 'Chrome' },
  { version: 'v2', target: 'Firefox' },
  { version: 'v3', target: 'Edge' },
  { version: 'v4', target: 'Mobile browser' },
]

function AnimatedMockup() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const phrases = ['secret revealed', 'media hiding']

  return (
    <Card className="glow-border overflow-hidden p-0">
      {/* Fake browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-card/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <div className="ml-3 flex-1 truncate rounded-md bg-bg/60 px-3 py-1 text-xs text-muted">
          news-example.com/article/crisis-report
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-text">
            <Wand2 className="h-4 w-4 text-primary" />
            TruthLens Guard
          </div>
          <Bell className="h-4 w-4 text-muted" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-card/50 p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              Article preview
            </div>
            <h3 className="text-base font-bold leading-snug text-text">
              Secret revealed: media hiding shocking crisis from families
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The article includes emotionally charged phrases like{' '}
              {phrases.map((p, i) => (
                <motion.mark
                  key={p}
                  initial={{ backgroundColor: 'transparent' }}
                  animate={phase >= 2 ? { backgroundColor: 'rgba(245,158,11,0.2)' } : {}}
                  transition={{ delay: i * 0.4 }}
                  className="rounded px-1 text-warning"
                >
                  {p}
                </motion.mark>
              )).reduce((acc, el, i) => (i === 0 ? [el] : [...acc, ' and ', el]), [])}
              , which may create distrust before evidence is presented.
            </p>
          </div>

          <motion.div
            animate={phase >= 3 ? { boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 24px rgba(239,68,68,0.35)', '0 0 0px rgba(239,68,68,0)'] } : {}}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="rounded-xl border border-danger/30 bg-danger/5 p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-danger" />
              <div>
                <div className="text-sm font-bold text-danger">High risk</div>
                <div className="text-xs text-muted">
                  Credibility <CountUp value={phase >= 1 ? 31 : 0} duration={1.2} />/100
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-text/90">
              <div>Clickbait score: <span className="font-semibold"><CountUp value={phase >= 1 ? 89 : 0} duration={1} /></span></div>
              <div>Propaganda probability: <span className="font-semibold"><CountUp value={phase >= 1 ? 77 : 0} duration={1.1} /></span></div>
              <div>Emotional manipulation: <span className="font-semibold"><CountUp value={phase >= 1 ? 92 : 0} duration={1.3} /></span></div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="sm" className="mt-4 w-full">Open Full Analysis</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Card>
  )
}

export default function Extension() {
  const [email, setEmail] = useState('')

  function handleNotify(e) {
    e.preventDefault()
    toast.success("You're on the list — we'll email you at launch.")
    setEmail('')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        {/* Left: pitch + checklist */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Browser Extension Concept
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Stop misinformation before you share it.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            A future TruthLens extension could scan article pages and social feeds, then surface risk
            badges before users repost misinformation.
          </p>

          <ul className="mt-6 space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-text">
                <CircleCheck className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: animated mockup */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <AnimatedMockup />
        </motion.div>
      </div>

      {/* Supported sites */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-14"
      >
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted">Works on</p>
        <div className="flex flex-wrap justify-center gap-3">
          {SUPPORTED_SITES.map((site) => (
            <span
              key={site}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted/70 grayscale transition-all hover:border-primary/40 hover:text-primary hover:grayscale-0"
            >
              {site}
            </span>
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <div className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-text">How it works</h2>
        <div className="mx-auto max-w-md space-y-1">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={step.label}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-card/40 p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-text">{step.label}</div>
                  <div className="mt-0.5 text-xs text-muted">{step.desc}</div>
                </div>
              </motion.div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-3.5 w-3.5 text-muted/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <Card className="h-full border-danger/20">
            <h3 className="mb-3 text-sm font-semibold text-danger">Without TruthLens</h3>
            <ul className="space-y-2">
              {COMPARISON.without.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-muted"><X className="h-3.5 w-3.5 text-danger" /> {c}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <Card className="h-full border-success/20">
            <h3 className="mb-3 text-sm font-semibold text-success">With TruthLens</h3>
            <ul className="space-y-2">
              {COMPARISON.with.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-text"><Check className="h-3.5 w-3.5 text-success" /> {c}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Feature cards */}
      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {FUTURE_FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card hover className="h-full">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-text">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-text">Platform roadmap</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {VERSIONS.map((v, i) => (
            <motion.div
              key={v.version}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-xl border border-white/5 bg-card/40 p-4 text-center"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">{v.version}</div>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-text">
                <Check className="h-3.5 w-3.5 text-success" /> {v.target}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mx-auto mt-16 max-w-md text-center"
      >
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
          <ScanEye className="h-3 w-3" /> Coming soon
        </div>
        <h3 className="text-xl font-bold text-text">Join the waitlist</h3>
        <Card className="mt-5">
          <form onSubmit={handleNotify} className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Button type="submit" icon={Bell} className="shrink-0">Notify Me</Button>
          </form>
        </Card>
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
          <Button variant="ghost" size="sm" icon={Star}>Star on GitHub</Button>
        </a>
      </motion.div>
    </div>
  )
}
