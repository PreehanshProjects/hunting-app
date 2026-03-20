import { PageWrapper } from '../../components/layout/PageWrapper'
import { AnimalCard } from './components/AnimalCard'
import { animals } from '../../data/animals'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '../../animations/variants'
import { useTranslation } from 'react-i18next'

export default function WildlifePage() {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-forest-500 font-bold uppercase tracking-[0.4em] text-xs"
              >
                {t('wildlife.tag')}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-display font-bold italic mt-4"
              >
                {t('wildlife.title')}
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md text-white/50 leading-relaxed font-body"
            >
              {t('wildlife.subtitle')}
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {animals.map((animal) => (
              <motion.div key={animal.id} variants={fadeInUp}>
                <AnimalCard animal={animal} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
