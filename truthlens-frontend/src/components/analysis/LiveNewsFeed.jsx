import { motion } from 'framer-motion'
import { Activity, ShieldCheck, ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/card'

const FEED = [
  { headline: 'Local hospital publishes transparent wait-time dashboard', tag: 'Likely reliable', score: 86, risk: false },
  { headline: 'Secret revealed: officials hiding shocking cure, post claims', tag: 'High risk', score: 24, risk: true },
  { headline: 'City council votes to expand public transit funding', tag: 'Likely reliable', score: 91, risk: false },
  { headline: "You won't believe what this celebrity said about vaccines", tag: 'High risk', score: 18, risk: true },
  { headline: 'University study links sleep quality to memory retention', tag: 'Likely reliable', score: 88, risk: false },
]

export default function LiveNewsFeed() {
  return (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Live News Feed Demo</h3>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-primary"
        >
          <Activity className="h-4 w-4" />
        </motion.div>
      </div>
      <p className="mb-5 text-sm text-muted">Mock trending headlines with AI credibility badges</p>

      <div className="space-y-3">
        {FEED.map((item, i) => (
          <motion.div
            key={item.headline}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            whileHover={{ x: 3 }}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-card/40 px-4 py-3.5 transition-colors hover:border-primary/20"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{item.headline}</p>
              <p className="mt-0.5 text-xs text-muted">{item.tag}</p>
            </div>
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                item.risk ? 'border-danger/30 bg-danger/10 text-danger' : 'border-success/30 bg-success/10 text-success'
              }`}
            >
              {item.risk ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              {item.score}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
