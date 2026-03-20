import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition'

export function CustomCursor() {
  const { x, y } = useMousePosition()
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'view'>('default')

  const springConfig = { stiffness: 150, damping: 18 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, a, [data-cursor="pointer"]')) {
        setCursorType('pointer')
      } else if (target.closest('[data-cursor="view"]')) {
        setCursorType('view')
      } else {
        setCursorType('default')
      }
    }

    document.addEventListener('mouseover', handleMouseEnter)
    return () => document.removeEventListener('mouseover', handleMouseEnter)
  }, [])

  const cursorVariants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(58, 122, 48, 0)',
      border: '2px solid rgba(58, 122, 48, 0.5)',
    },
    pointer: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(58, 122, 48, 0.2)',
      border: '2px solid rgba(58, 122, 48, 0.8)',
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(58, 122, 48, 0.3)',
      border: '2px solid rgba(58, 122, 48, 1)',
    }
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-forest-500 rounded-full pointer-events-none z-[9999]"
        style={{ x: x - 4, y: y - 4 }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center text-[10px] font-bold tracking-widest text-white"
        animate={cursorType}
        variants={cursorVariants}
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      >
        {cursorType === 'view' && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>VIEW</motion.span>}
      </motion.div>
    </>
  )
}
