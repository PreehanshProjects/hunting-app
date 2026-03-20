import { motion } from 'framer-motion'
import { ForestParticles } from '../../../components/particles/ForestParticles'
import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { scaleIn, textRevealChar } from '../../../animations/variants'
import { useTranslation } from 'react-i18next'

export function HeroSection() {
  const { t } = useTranslation()
  const line1 = t('hero.line1')
  const line2 = t('hero.line2')

  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-radial-dark z-[-2]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-950/20 to-forest-950 z-[-1]" />
      <ForestParticles />

      <div className="relative z-10 text-center px-6">
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="text-5xl md:text-8xl font-display font-bold italic text-white flex justify-center flex-wrap"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {line1.split('').map((char, i) => (
              <motion.span key={i} variants={textRevealChar}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl md:text-4xl font-display italic text-forest-400 mb-8"
        >
          {line2}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="max-w-xl mx-auto text-white/60 text-lg mb-12 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.5 } } }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.div variants={scaleIn}>
            <Link
              to="/wildlife"
              className="px-8 py-4 bg-forest-600 text-white font-bold rounded-full hover:bg-forest-500 transition-all hover:scale-105 shadow-[0_0_20px_rgba(58,122,48,0.3)] hover:shadow-[0_0_30px_rgba(58,122,48,0.5)]"
            >
              {t('hero.cta_wildlife')}
            </Link>
          </motion.div>
          <motion.div variants={scaleIn}>
            <Link
              to="/guide"
              className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105"
            >
              {t('hero.cta_guide')}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">{t('hero.scroll')}</span>
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </section>
  )
}
