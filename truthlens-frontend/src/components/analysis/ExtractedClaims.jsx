import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export default function ExtractedClaims({ claims }) {
  if (!claims?.length) return null

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-text">Extracted Claims</h3>
      <div className="space-y-3">
        {claims.map((claim, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="rounded-xl border border-white/5 bg-card/40 p-4"
          >
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              Claim {i + 1}
            </div>
            <p className="text-sm leading-relaxed text-text/90">{claim}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
