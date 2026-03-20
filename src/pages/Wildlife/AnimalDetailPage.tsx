import { useParams, Link } from 'react-router-dom'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { animals } from '../../data/animals'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, Zap, Wind, Target, MapPin, Calendar, ShieldAlert } from 'lucide-react'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { DeerScene } from '../../components/three/DeerScene'
import { useTranslation } from 'react-i18next'

export default function AnimalDetailPage() {
  const { id } = useParams()
  const animal = animals.find(a => a.id === id)
  const heroRef = useRef(null)
  const { t, i18n } = useTranslation()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  if (!animal) return <div>Animal not found</div>

  const animalKey = animal.id as 'rusa-deer' | 'wild-boar' | 'hare'
  const hasTranslation = i18n.exists(`animals.${animalKey}.name`)
  const localizedAnimal = hasTranslation ? {
    name: t(`animals.${animalKey}.name`),
    longDescription: t(`animals.${animalKey}.longDescription`),
    techniques: t(`animals.${animalKey}.techniques`, { returnObjects: true }) as string[],
    legalNotes: t(`animals.${animalKey}.legalNotes`, { returnObjects: true }) as string[],
  } : {
    name: animal.name,
    longDescription: animal.longDescription,
    techniques: animal.techniques,
    legalNotes: animal.legalNotes,
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[90vh] overflow-hidden">
        <motion.div style={{ scale, opacity, y }} className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${animal.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20">
          <div className="max-w-7xl mx-auto w-full">
            <Link to="/wildlife" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> {t('animalDetail.back')}
            </Link>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-forest-400 font-bold uppercase tracking-[0.4em] text-sm block mb-4"
            >
              {animal.scientificName}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-display font-bold italic text-white"
            >
              {localizedAnimal.name}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 relative z-10 bg-forest-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* Left Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              <div className="p-8 bg-forest-900/40 border border-white/5 rounded-3xl space-y-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4">{t('animalDetail.difficulty')}</h4>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 w-2 rounded-full ${i < animal.difficulty ? 'bg-forest-500' : 'bg-white/5'}`}
                      />
                    ))}
                    <span className="ml-4 text-xl font-display italic font-bold">{animal.difficulty}/5</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <StatDetail icon={Zap} label={t('animalDetail.speed')} value={animal.stats.speed} />
                  <StatDetail icon={Wind} label={t('animalDetail.stealth')} value={animal.stats.stealth} />
                  <StatDetail icon={Target} label={t('animalDetail.rarity')} value={animal.stats.rarity} />
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <InfoItem icon={Calendar} label={t('animalDetail.season')} value={animal.season} />
                  <InfoItem icon={MapPin} label={t('animalDetail.habitat')} value={animal.habitat.join(', ')} />
                </div>
              </div>

              <div className="p-8 bg-amber-glow/10 border border-amber-glow/20 rounded-3xl">
                <div className="flex items-center gap-3 text-amber-glow mb-4">
                  <ShieldAlert className="w-5 h-5" />
                  <h4 className="font-bold uppercase tracking-widest text-xs">{t('animalDetail.legal_reminder')}</h4>
                </div>
                <ul className="space-y-3">
                  {localizedAnimal.legalNotes.map((note, i) => (
                    <li key={i} className="text-white/60 text-sm leading-relaxed flex gap-2">
                      <span className="text-amber-glow">•</span> {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8 space-y-24">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold italic">{t('animalDetail.natural_history')}</h2>
              <p className="text-white/60 text-xl leading-relaxed font-body">{localizedAnimal.longDescription}</p>
            </div>

            {animal.images && animal.images.length > 1 && (
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-display font-bold italic">{t('animalDetail.gallery')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {animal.images.map((src, i) => (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className={`overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-square'}`}>
                        <img
                          src={src}
                          alt={`${localizedAnimal.name} ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold italic">{t('animalDetail.techniques')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localizedAnimal.techniques.map((tech, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="p-8 bg-forest-900/20 border border-white/5 rounded-2xl group hover:bg-forest-800/40 transition-colors">
                      <h4 className="text-xl font-bold mb-2">{tech}</h4>
                      <p className="text-white/40 text-sm">{t('animalDetail.professional')}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {animal.id === 'rusa-deer' && (
              <div className="h-[500px] w-full bg-forest-900/20 border border-white/5 rounded-3xl overflow-hidden relative">
                <div className="absolute top-8 left-8 z-10">
                  <h3 className="text-2xl font-display font-bold italic mb-2">{t('animalDetail.viewer_title')}</h3>
                  <p className="text-white/40 text-sm italic">{t('animalDetail.viewer_sub')}</p>
                </div>
                <DeerScene />
                <div className="absolute bottom-8 right-8 z-10 text-[10px] uppercase tracking-widest text-white/20">
                  {t('animalDetail.viewer_hint')}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

function StatDetail({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
        <div className="flex items-center gap-2"><Icon className="w-3 h-3" /> {label}</div>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-forest-400" />
      </div>
      <div>
        <h5 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">{label}</h5>
        <p className="text-sm text-white/80 leading-relaxed">{value}</p>
      </div>
    </div>
  )
}
