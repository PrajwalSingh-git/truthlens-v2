import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import CountUp from '@/components/ui/count-up'

const toneColors = {
  primary: '#22D3EE',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
}

export function scoreToTone(score) {
  if (score >= 70) return 'success'
  if (score >= 40) return 'warning'
  return 'danger'
}

export default function Meter({ label, value, tone, size = 120, strokeWidth = 10 }) {
  const resolvedTone = tone || scoreToTone(value)
  const color = toneColors[resolvedTone]
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#112131" strokeWidth={strokeWidth} fill="none" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
            style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text">
            <CountUp value={value} decimals={0} duration={1.1} />
          </span>
          <span className="text-[10px] uppercase tracking-wide text-muted">/ 100</span>
        </div>
      </motion.div>
      {label && <span className="text-sm font-medium text-muted">{label}</span>}
    </div>
  )
}

export function BarMeter({ label, value, tone }) {
  const resolvedTone = tone || scoreToTone(100 - value)
  const color = toneColors[resolvedTone]

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-text">{label}</span>
        <span className="text-muted">
          <CountUp value={value} decimals={0} duration={0.9} suffix="%" />
        </span>
      </div>
      <Progress
        value={value}
        indicatorStyle={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
      />
    </motion.div>
  )
}
