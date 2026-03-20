import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { animals } from '../../../data/animals'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FeaturedAnimal() {
  const containerRef = useRef(null)
  const rusa = animals.find(a => a.id === 'rusa-deer')!
  const { t } = useTranslation()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])

  const animalT = t('animals.rusa-deer', { returnObjects: true }) as { name: string; description: string }

  return (
    <section ref={containerRef} className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: Image with Parallax */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-0 w-full h-[120%]"
          >
            <div
              className="w-full h-full bg-forest-800 bg-cover bg-center"
              style={{ backgroundImage: `url(${rusa.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
          </motion.div>
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />

          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {rusa.habitat.map(h => (
                <span key={h} className="px-3 py-1 bg-forest-950/80 backdrop-blur-md text-[10px] uppercase tracking-widest text-white/60 border border-white/10 rounded-full">
                  {h}
                </span>
              ))}
            </div>
            <h3 className="text-3xl font-display font-bold italic mb-2">{animalT.name}</h3>
            <p className="text-white/50 text-sm font-body tracking-wide">{rusa.scientificName}</p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <span className="text-forest-500 font-bold uppercase tracking-[0.4em] text-xs">{t('featured.label')}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold italic">{t('featured.title')}</h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-lg">{animalT.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <StatBar label={t('featured.speed')} value={rusa.stats.speed} />
            <StatBar label={t('featured.stealth')} value={rusa.stats.stealth} />
            <StatBar label={t('featured.rarity')} value={rusa.stats.rarity} />
            <StatItem label={t('featured.weight')} value={rusa.stats.weight} />
          </div>

          <div className="pt-8 flex gap-6">
            <Link
              to={`/wildlife/${rusa.id}`}
              className="group flex items-center gap-3 px-8 py-4 bg-forest-600 rounded-full text-white font-bold transition-all hover:bg-forest-500 hover:gap-5"
            >
              {t('featured.cta')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-forest-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-forest-500 shadow-[0_0_10px_rgba(58,122,48,0.5)]"
        />
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{label}</span>
      <p className="text-xl font-display font-bold text-white italic">{value}</p>
    </div>
  )
}
