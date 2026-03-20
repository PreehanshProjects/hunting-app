import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'backOut' } },
}

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -8, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const glowPulse: Variants = {
  rest: { boxShadow: '0 0 0px rgba(58, 122, 48, 0)' },
  hover: { boxShadow: '0 0 40px rgba(58, 122, 48, 0.5)', transition: { duration: 0.4 } },
}

export const textRevealChar: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const pageTransition: Variants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6 } },
  exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } },
}
