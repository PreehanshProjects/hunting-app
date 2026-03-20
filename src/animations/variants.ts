import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28, willChange: 'opacity, transform' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -36, willChange: 'opacity, transform' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, willChange: 'opacity, transform' },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'backOut' } },
}

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -6, transition: { duration: 0.25, ease: 'easeOut' } },
}

export const glowPulse: Variants = {
  rest: { boxShadow: '0 0 0px rgba(58, 122, 48, 0)' },
  hover: { boxShadow: '0 0 40px rgba(58, 122, 48, 0.5)', transition: { duration: 0.4 } },
}

export const textRevealChar: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

// No blur — blur forces full repaint on every frame and is very slow on mobile.
// Simple opacity-only fade is GPU-composited and buttery smooth.
export const pageTransition: Variants = {
  initial: { opacity: 0, willChange: 'opacity' },
  animate: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
}
