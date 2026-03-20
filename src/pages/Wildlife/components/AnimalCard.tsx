import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Animal } from '../../../types'
import { cardHover } from '../../../animations/variants'
import { Target, Wind, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  animal: Animal
}

export function AnimalCard({ animal }: Props) {
  const { t, i18n } = useTranslation()
  const animalKey = animal.id as 'rusa-deer' | 'wild-boar' | 'hare'
  const localizedName = i18n.exists(`animals.${animalKey}.name`)
    ? t(`animals.${animalKey}.name`)
    : animal.name

  const difficultyLabel =
    animal.difficulty <= 2
      ? t('wildlife.novice')
      : animal.difficulty <= 4
      ? t('wildlife.intermediate')
      : t('wildlife.expert')

  return (
    <Link to={`/wildlife/${animal.id}`} className="block group">
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="relative h-[450px] w-full bg-forest-900/40 border border-white/5 rounded-2xl overflow-hidden perspective-1000"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${animal.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <span className="px-3 py-1 bg-forest-600/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
            {difficultyLabel}
          </span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-full ${i < animal.difficulty ? 'bg-forest-400' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
          <span className="text-forest-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
            {animal.scientificName}
          </span>
          <h3 className="text-3xl font-display font-bold italic mb-4">{localizedName}</h3>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <StatItem icon={Zap} value={animal.stats.speed} />
            <StatItem icon={Wind} value={animal.stats.stealth} />
            <StatItem icon={Target} value={animal.stats.rarity} />
          </div>
        </div>

        <div className="absolute inset-0 bg-forest-600/0 group-hover:bg-forest-600/10 transition-colors duration-500" />
      </motion.div>
    </Link>
  )
}

function StatItem({ icon: Icon, value }: { icon: any, value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="w-4 h-4 text-white/30" />
      <span className="text-xs font-bold text-white/80">{value}</span>
    </div>
  )
}
