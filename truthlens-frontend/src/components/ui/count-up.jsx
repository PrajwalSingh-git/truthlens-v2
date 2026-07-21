import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion'

export default function CountUp({ value, decimals = 0, suffix = '', duration = 1.2, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) => v.toFixed(decimals) + suffix)

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}
