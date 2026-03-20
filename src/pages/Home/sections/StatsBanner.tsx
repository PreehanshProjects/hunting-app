import { useInView } from 'react-intersection-observer'
import { useCountUp } from '../../../hooks/useCountUp'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../../animations/variants'
import { useTranslation } from 'react-i18next'

export function StatsBanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { t } = useTranslation()

  return (
    <section ref={ref} className="bg-earth-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <StatItem value={3} label={t('stats.species')} inView={inView} />
        <StatItem value={6} label={t('stats.zones')} inView={inView} />
        <StatItem value={12} label={t('stats.laws')} suffix="+" inView={inView} />
      </div>
    </section>
  )
}

function StatItem({ value, label, suffix = '', inView }: { value: number, label: string, suffix?: string, inView: boolean }) {
  const count = useCountUp(value, 2000, inView)

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="flex flex-col items-center"
    >
      <span className="text-6xl md:text-7xl font-display font-bold text-amber-glow mb-2">
        {count}{suffix}
      </span>
      <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold">
        {label}
      </span>
    </motion.div>
  )
}
