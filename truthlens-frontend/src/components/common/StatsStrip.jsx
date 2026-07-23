import { motion } from 'framer-motion'
import CountUp from '@/components/ui/count-up'

export default function StatsStrip({ stats, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-6 sm:grid-cols-4 ${className}`}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-primary sm:text-3xl">
            {s.isNumeric === false ? (
              s.value
            ) : (
              <CountUp value={s.value} suffix={s.suffix || ''} duration={1.2} />
            )}
          </div>
          <div className="mt-1 text-xs text-muted sm:text-sm">{s.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
