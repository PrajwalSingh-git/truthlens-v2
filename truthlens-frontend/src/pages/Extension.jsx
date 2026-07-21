import { motion } from 'framer-motion'
import { CircleCheck, Bell, Wand2, ShieldAlert, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CHECKLIST = ['Inline credibility badge', 'Suspicious phrase overlay', 'One-click verification checklist']

const FUTURE_FEATURES = [
  { icon: ShieldAlert, title: 'Social media overlay', desc: 'A future expansion path that turns the hackathon prototype into a platform.' },
  { icon: Globe, title: 'Article URL auto-scan', desc: 'A future expansion path that turns the hackathon prototype into a platform.' },
  { icon: Bell, title: 'Share warning prompt', desc: 'A future expansion path that turns the hackathon prototype into a platform.' },
]

export default function Extension() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        {/* Left: pitch + checklist */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Browser Extension Concept
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Real-time credibility warnings wherever news appears.
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

        {/* Right: TruthLens Guard popup mockup */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Card className="glow-border">
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
                  <mark className="rounded bg-warning/20 px-1 text-warning">secret revealed</mark> and{' '}
                  <mark className="rounded bg-warning/20 px-1 text-warning">media hiding</mark>, which may
                  create distrust before evidence is presented.
                </p>
              </div>

              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-danger" />
                  <div>
                    <div className="text-sm font-bold text-danger">High risk</div>
                    <div className="text-xs text-muted">Credibility 31/100</div>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-text/90">
                  <div>Clickbait score: <span className="font-semibold">89</span></div>
                  <div>Propaganda probability: <span className="font-semibold">77</span></div>
                  <div>Emotional manipulation: <span className="font-semibold">92</span></div>
                </div>
                <Button size="sm" className="mt-4 w-full">Open Full Analysis</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Future feature cards */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
    </div>
  )
}
