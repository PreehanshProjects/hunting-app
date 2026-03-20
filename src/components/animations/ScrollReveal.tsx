import { motion } from 'framer-motion'
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
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
