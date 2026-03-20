import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Moon, Target, Gavel } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function QuickLawWarning() {
  const { t } = useTranslation()

  const warnings = [
    {
      icon: ShieldAlert,
      title: t('quicklaw.items.license_title'),
      short: t('quicklaw.items.license_short'),
      penalty: t('quicklaw.items.license_penalty'),
    },
    {
      icon: Moon,
      title: t('quicklaw.items.night_title'),
      short: t('quicklaw.items.night_short'),
      penalty: t('quicklaw.items.night_penalty'),
    },
    {
      icon: Target,
      title: t('quicklaw.items.caliber_title'),
      short: t('quicklaw.items.caliber_short'),
      penalty: t('quicklaw.items.caliber_penalty'),
    },
  ]

  return (
    <section className="py-24 px-6 bg-forest-950">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="text-blood font-bold uppercase tracking-[0.4em] text-xs">{t('quicklaw.tag')}</span>
        <h2 className="text-4xl md:text-6xl font-display font-bold italic mt-4">{t('quicklaw.title')}</h2>
        <p className="text-white/40 mt-6 max-w-2xl mx-auto">{t('quicklaw.subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {warnings.map((w, i) => (
          <FlipCard key={i} {...w} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/law"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          {t('quicklaw.view_full')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}

function FlipCard({ icon: Icon, title, short, penalty }: { icon: any, title: string, short: string, penalty: string }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { t } = useTranslation()

  return (
    <div
      className="relative h-64 perspective-1000 group cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-forest-900/40 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-forest-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-forest-400" />
          </div>
          <h4 className="text-xl font-display font-bold italic mb-2">{title}</h4>
          <p className="text-white/40 text-sm leading-relaxed">{short}</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-blood/20 border border-blood/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center rotate-y-180">
          <Gavel className="w-10 h-10 text-blood mb-4" />
          <h4 className="text-lg font-bold uppercase tracking-widest text-blood mb-2">{t('quicklaw.penalty')}</h4>
          <p className="text-white/80 text-sm leading-relaxed font-medium">{penalty}</p>
        </div>
      </motion.div>
    </div>
  )
}
