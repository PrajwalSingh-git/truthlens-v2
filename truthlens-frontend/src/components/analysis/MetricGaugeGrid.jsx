import { motion } from 'framer-motion'
import { Gauge, Sparkles, Megaphone, TriangleAlert, Scale, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import CountUp from '@/components/ui/count-up'
import { scoreToTone } from '@/components/ui/meter'

const toneColors = { success: '#22C55E', warning: '#F59E0B', danger: '#EF4444' }

function GaugeCard({ icon: Icon, title, description, value, invert = false, delay = 0 }) {
  // For "concern" metrics (clickbait/propaganda/emotional/political-bias), a
  // HIGH number means MORE risk, so tone logic is inverted vs credibility.
  const tone = invert ? scoreToTone(100 - value) : scoreToTone(value)
  const color = toneColors[tone]
  const radius = 32
  const strokeWidth = 7
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
    >
      <Card hover className="h-full">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2 text-text">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold leading-tight">{title}</span>
          </div>
          <Info className="h-3.5 w-3.5 shrink-0 text-muted/60" aria-hidden="true" />
        </div>
        <p className="mb-4 text-xs leading-snug text-muted">{description}</p>

        <div className="flex items-center gap-3">
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <svg width={76} height={76} className="-rotate-90">
              <circle cx={38} cy={38} r={radius} stroke="#112131" strokeWidth={strokeWidth} fill="none" />
              <motion.circle
                cx={38}
                cy={38}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-text">
              <CountUp value={value} decimals={0} duration={1} />
            </div>
          </div>
          <div className="flex-1">
            <Progress value={value} indicatorStyle={{ backgroundColor: color }} className="h-1.5" />
            <div className="mt-1.5 text-[10px] uppercase tracking-wide text-muted">Signal strength</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function MetricGaugeGrid({ result }) {
  const metrics = [
    {
      icon: Gauge,
      title: 'Credibility Score',
      description: 'Higher means stronger reliability signals',
      value: result.credibility,
      invert: false,
    },
    {
      icon: Sparkles,
      title: 'Clickbait Score',
      description: 'Sensational headline and curiosity-gap risk',
      value: result.signals.clickbait,
      invert: true,
    },
    {
      icon: Megaphone,
      title: 'Propaganda Probability',
      description: 'Manipulative persuasion pattern probability',
      value: result.signals.propaganda,
      invert: true,
    },
    {
      icon: TriangleAlert,
      title: 'Emotional Manipulation',
      description: 'Fear, outrage, urgency, and anxiety cues',
      value: result.signals.emotional_manipulation,
      invert: true,
    },
    {
      icon: Scale,
      title: 'Political Bias Meter',
      description: 'Estimated ideological framing intensity',
      value: result.signals.political_bias,
      invert: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((m, i) => (
        <GaugeCard key={m.title} {...m} delay={i * 0.06} />
      ))}
    </div>
  )
}
