import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function PhraseIntelligence({ flags }) {
  if (!flags?.length) return null

  // De-duplicate by label so we don't show 6 near-identical "Sensational hook" cards
  const seen = new Set()
  const unique = flags.filter((f) => {
    const key = `${f.label}:${f.description}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text">Phrase Intelligence</h3>
          <p className="mt-1 text-sm text-muted">Why each highlighted phrase may be manipulative</p>
        </div>
        <CircleCheck className="h-4 w-4 text-primary" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {unique.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-xl border border-white/5 bg-card/40 p-4"
          >
            <span className="inline-block rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-warning">
              {f.label.toLowerCase()}
            </span>
            <h4 className="mt-2.5 text-sm font-semibold text-text">{f.label}</h4>
            <p className="mt-1.5 text-sm text-muted">{f.description}</p>
            <p className="mt-2 text-xs text-primary/80">{f.tip}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
