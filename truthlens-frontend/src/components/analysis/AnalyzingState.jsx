import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, ServerCog } from 'lucide-react'

const steps = [
  'Parsing content structure…',
  'Scanning for bias signals…',
  'Checking propaganda patterns…',
  'Evaluating emotional language…',
  'Compiling explanation…',
]

export default function AnalyzingState({ wakingUp = false }) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-2xl p-16 text-center" role="status" aria-live="polite">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <ScanSearch className="h-6 w-6 text-primary" />
      </div>

      <AnimatePresence mode="wait">
        {wakingUp ? (
          <motion.div
            key="waking"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="flex items-center justify-center gap-2 font-semibold text-text">
              <ServerCog className="h-4 w-4 text-warning" />
              Reconnecting to the server
            </h3>
            <p className="mt-2 max-w-xs text-xs text-muted">
              The first attempt didn't go through — retrying now. If this backend is hosted on a free
              tier, it may just be waking up from sleep.
            </p>
          </motion.div>
        ) : (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="font-semibold text-text">Analyzing content</h3>
            <div className="mt-3 space-y-1.5">
              {steps.map((s, i) => (
                <motion.p
                  key={s}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="text-xs text-muted"
                >
                  {s}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
