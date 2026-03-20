import { PageWrapper } from '../../components/layout/PageWrapper'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* Animated Fog/Mist */}
        <motion.div
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10 pointer-events-none"
        >
          <div className="w-full h-full bg-[radial-gradient(circle,white_0%,transparent_70%)] blur-3xl scale-150 transform -translate-y-1/2" />
        </motion.div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-forest-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-forest-800 animate-pulse">
            <Compass className="w-12 h-12 text-forest-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold italic mb-6">{t('notfound.title')}</h1>
          <p className="text-white/40 text-xl mb-12 max-w-md mx-auto leading-relaxed">
            {t('notfound.subtitle')}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-3 px-10 py-4 bg-forest-600 text-white font-bold rounded-full hover:bg-forest-500 transition-all hover:gap-5"
          >
            {t('notfound.cta')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-forest-950 to-transparent" />
      </section>
    </PageWrapper>
  )
}
