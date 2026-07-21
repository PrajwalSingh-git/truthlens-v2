import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import CountUp from '@/components/ui/count-up'

export default function ShareabilityRisk({ value }) {
  return (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold text-text">Shareability Risk</h3>
        <Share2 className="h-4 w-4 text-primary" />
      </div>
      <p className="mb-5 text-sm text-muted">How risky this is to repost without verification</p>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-card">
        <div className="absolute inset-0 bg-gradient-to-r from-success via-warning to-danger" />
        <motion.div
          className="absolute inset-y-0 right-0 bg-bg/70"
          initial={{ width: '100%' }}
          animate={{ width: `${100 - value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-4 text-4xl font-bold text-text">
        <CountUp value={value} decimals={0} duration={1.1} />
      </div>

      <p className="mt-3 text-sm text-muted">
        Pause, verify the primary claim, and check context before sharing content with a high risk score.
      </p>
    </Card>
  )
}
