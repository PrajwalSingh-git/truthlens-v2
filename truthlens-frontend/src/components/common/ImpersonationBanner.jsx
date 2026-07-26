import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X } from 'lucide-react'
import { getImpersonation, clearImpersonation } from '@/services/adminApi'

export default function ImpersonationBanner() {
  const [impersonation, setImpersonationState] = useState(getImpersonation())
  const navigate = useNavigate()

  useEffect(() => {
    // Re-check on route changes in case it was cleared elsewhere.
    setImpersonationState(getImpersonation())
  })

  function handleExit() {
    clearImpersonation()
    setImpersonationState(null)
    navigate('/creator-admin')
  }

  return (
    <AnimatePresence>
      {impersonation && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-warning/15 px-4 py-2 text-sm text-warning backdrop-blur"
        >
          <Eye className="h-4 w-4" />
          <span>
            Admin viewing as <span className="font-semibold">{impersonation.email}</span>
          </span>
          <button
            onClick={handleExit}
            className="flex items-center gap-1 rounded-full border border-warning/30 px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-warning/10"
          >
            <X className="h-3 w-3" /> Exit
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
