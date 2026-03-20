import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { fadeInUp } from '../../animations/variants'

interface Props {
  children: React.ReactNode
  variant?: Variants
  delay?: number
  className?: string
}

export function ScrollReveal({ children, variant = fadeInUp, delay = 0, className }: Props) {
  const prefersReduced = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  // If user prefers reduced motion, render without animation
  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
