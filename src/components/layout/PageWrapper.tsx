import { motion } from 'framer-motion'
import { pageTransition } from '../../animations/variants'

interface Props {
  children: React.ReactNode
}

export function PageWrapper({ children }: Props) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-16 sm:pt-20"
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  )
}
